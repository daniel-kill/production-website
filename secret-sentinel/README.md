# secret-sentinel

🛡️ **High-Throughput Secret & Security Posture Scanner**

`secret-sentinel` is a security CLI utility designed to prevent credential leaks, API tokens, private keys, and sensitive environment variables from entering Git history. It combines high-accuracy regex signatures with Shannon entropy calculations and contextual heuristic filtering to eliminate false positives.

---

## ⚡ Features

- **Entropy & Pattern Matching:** Identifies high-entropy secrets and standard credential signatures (AWS, GitHub, Stripe, Discord, OpenAI, Anthropic, private RSA/ED25519 keys).
- **False-Positive Elimination:** Heuristics filter out commit hashes, UUIDs, hex color codes, and mock testing fixtures.
- **Pre-Commit Hook Integration:** Zero-configuration local hook installation (`secret-sentinel install-hook`) that blocks commits before secrets are staged.
- **SARIF Code Scanning Export:** Native `--format sarif` output format for automated GitHub Security integration.
- **Exemption Baselines:** Support for `.secretsentinelignore` and baseline hashes for legacy configurations.
- **Cryptographic Hygiene:** Integrated with strict GPG commit verification standards.

---

## 🚀 Installation & Quick Start

```bash
# Clone the repository
git clone git@github.com:daniel-kill/secret-sentinel.git
cd secret-sentinel

# Install in development mode
pip install -e .

# Scan current workspace
secret-sentinel scan .

# Install Git pre-commit hook
secret-sentinel install-hook
```

---

## 🛠️ Usage

```bash
# Scan a specific file or folder
secret-sentinel scan ./src

# Scan with custom minimum entropy threshold
secret-sentinel scan . --min-entropy 4.2

# Export findings to SARIF format for CI/CD
secret-sentinel scan . --format sarif > results.sarif
```

---

## 🧪 Testing & Linting

```bash
# Run test suite
pytest -v

# Run code formatting and linter
ruff check .
```

---

## 📜 License

MIT © [Daniel Kill](https://github.com/daniel-kill)
