import stat
from pathlib import Path

HOOK_SCRIPT = """#!/usr/bin/env bash
# Secret Sentinel Git Pre-Commit Hook
# Automatically blocks commits containing hardcoded secrets and credentials.

if command -v secret-sentinel >/dev/null 2>&1; then
    CMD="secret-sentinel"
elif [ -f "./venv/bin/secret-sentinel" ]; then
    CMD="./venv/bin/secret-sentinel"
else
    # Allow bypass if tool is not installed in the current environment
    exit 0
fi

echo "🛡️  Running Secret Sentinel pre-commit security verification..."
$CMD scan . --fail-on-secrets

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Commit rejected by Secret Sentinel: Uncommitted secrets or sensitive tokens detected."
    echo "Please remove the exposed secret or add the file to .secretsentinelignore."
    exit $EXIT_CODE
fi

exit 0
"""


def install_pre_commit_hook(repo_root: Path) -> bool:
    """Install the Secret Sentinel pre-commit hook into the specified Git repository."""
    git_hooks_dir = repo_root / ".git" / "hooks"
    if not git_hooks_dir.exists():
        return False

    hook_file = git_hooks_dir / "pre-commit"
    hook_file.write_text(HOOK_SCRIPT, encoding="utf-8")

    # Grant executable permissions
    current_permissions = hook_file.stat().st_mode
    hook_file.chmod(current_permissions | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return True
