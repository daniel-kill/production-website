import math
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Finding:
    rule_name: str
    file_path: str
    line_number: int
    secret_preview: str
    entropy: float
    severity: str  # CRITICAL, HIGH, MEDIUM


# Pre-compiled high-confidence regular expressions for known secret formats
SECRET_PATTERNS = [
    ("AWS Access Key", re.compile(r"\b(AKIA[0-9A-Z]{16})\b"), "CRITICAL"),
    ("GitHub Token", re.compile(r"\b(gh[pousr]_[A-Za-z0-9_]{36,255})\b"), "CRITICAL"),
    (
        "Generic Private Key",
        re.compile(r"-----BEGIN (?:RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----"),
        "CRITICAL",
    ),
    ("Stripe API Key", re.compile(r"\b(sk_live_[0-9a-zA-Z]{24,34})\b"), "CRITICAL"),
    (
        "Discord Bot Token",
        re.compile(r"\b([MN][A-Za-z\d]{23,25}\.[A-Za-z\d_\-]{6}\.[A-Za-z\d_\-]{27,38})\b"),
        "CRITICAL",
    ),
    ("OpenAI API Key", re.compile(r"\b(sk-[a-zA-Z0-9]{20,48})\b"), "HIGH"),
    ("Anthropic API Key", re.compile(r"\b(sk-ant-[a-zA-Z0-9]{32,100})\b"), "HIGH"),
    (
        "Generic API Key Assignment",
        re.compile(
            r"(?i)(?:api_key|secret_key|auth_token|password|bearer|secret)"
            r"\s*[:=]\s*['\"]([a-zA-Z0-9_\-\.]{16,128})['\"]"
        ),
        "MEDIUM",
    ),
]

# Patterns that indicate false positives (e.g. UUIDs, hex hashes, placeholders)
FALSE_POSITIVE_PATTERNS = [
    re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I),  # UUID
    re.compile(r"^[0-9a-f]{32}$|^[0-9a-f]{40}$|^[0-9a-f]{64}$", re.I),  # pure md5/sha1/sha256 hash
    re.compile(r"(?i)example|dummy|sample|mock|test|fake|placeholder|xxxxxx"),
]


def shannon_entropy(data: str) -> float:
    """Calculate the Shannon entropy of a given string.

    Higher entropy (> 3.5 - 4.5) typically indicates randomized cryptographic secrets.
    """
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    frequencies = {char: data.count(char) for char in set(data)}
    for count in frequencies.values():
        p_x = count / length
        entropy += -p_x * math.log2(p_x)
    return round(entropy, 2)


def is_false_positive(candidate: str) -> bool:
    """Check if the extracted secret candidate matches known false-positive heuristics."""
    for pattern in FALSE_POSITIVE_PATTERNS:
        if pattern.search(candidate):
            return True
    return False


def mask_secret(secret: str) -> str:
    """Mask sensitive string content for safe display in logs and terminals."""
    if len(secret) <= 8:
        return "*" * len(secret)
    return secret[:4] + "*" * (len(secret) - 8) + secret[-4:]


def scan_file(file_path: Path, min_entropy: float = 3.6) -> list[Finding]:
    """Scan a single file for sensitive patterns and high-entropy secrets."""
    findings: list[Finding] = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except (OSError, UnicodeDecodeError):
        return findings

    lines = content.splitlines()
    for line_idx, line in enumerate(lines, start=1):
        # Ignore comments or mock lines
        stripped = line.strip()
        if stripped.startswith(("#", "//", "/*", "*")):
            continue

        for rule_name, pattern, severity in SECRET_PATTERNS:
            match = pattern.search(line)
            if match:
                candidate = match.group(1) if match.groups() else match.group(0)
                if is_false_positive(candidate):
                    continue

                entropy = shannon_entropy(candidate)
                # For generic assignments, require sufficient entropy to prevent false alarms
                if "Generic" in rule_name and entropy < min_entropy:
                    continue

                findings.append(Finding(
                    rule_name=rule_name,
                    file_path=str(file_path),
                    line_number=line_idx,
                    secret_preview=mask_secret(candidate),
                    entropy=entropy,
                    severity=severity
                ))
                break

    return findings
