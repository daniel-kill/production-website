import json
from pathlib import Path

from typer.testing import CliRunner

from secret_sentinel.cli import app
from secret_sentinel.scanner import is_false_positive, mask_secret, shannon_entropy

runner = CliRunner()


def test_shannon_entropy():
    # Low entropy (repetitive)
    assert shannon_entropy("aaaaaaaa") == 0.0
    # High entropy (randomized secret token)
    entropy = shannon_entropy("x8K9pQ2mZ1vW7yL4tR0j")
    assert entropy > 3.8


def test_mask_secret():
    assert mask_secret("12345") == "*****"
    assert mask_secret("AKIAIOSFODNN7EXAMPLE") == "AKIA************MPLE"


def test_false_positive_detection():
    assert is_false_positive("123e4567-e89b-12d3-a456-426614174000") is True  # UUID
    assert is_false_positive("mock_api_key_for_testing") is True  # mock test pattern
    assert is_false_positive("AKIAIOSFODNN7PROD123") is False


def test_cli_help():
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "Secret Sentinel" in result.stdout


def test_cli_version():
    result = runner.invoke(app, ["--version"])
    assert result.exit_code == 0
    assert "Secret Sentinel CLI v" in result.stdout


def test_scan_clean_directory(tmp_path: Path):
    clean_file = tmp_path / "app.py"
    clean_file.write_text("print('Hello safe world!')\n")
    result = runner.invoke(app, ["scan", str(tmp_path)])
    assert result.exit_code == 0
    assert "No exposed secrets detected" in result.stdout


def test_scan_exposed_secret(tmp_path: Path):
    vuln_file = tmp_path / "config.py"
    vuln_file.write_text("AWS_KEY = 'AKIAIOSFODNN7PROD123'\n")
    result = runner.invoke(app, ["scan", str(tmp_path)])
    assert result.exit_code == 1
    assert "AWS Access Key" in result.stdout


def test_scan_sarif_export(tmp_path: Path):
    vuln_file = tmp_path / "config.py"
    vuln_file.write_text("GITHUB_TOKEN = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'\n")
    result = runner.invoke(app, ["scan", str(tmp_path), "--format", "sarif", "--no-fail"])
    assert result.exit_code == 0
    sarif = json.loads(result.stdout)
    assert sarif["version"] == "2.1.0"
    assert len(sarif["runs"][0]["results"]) == 1


def test_install_pre_commit_hook(tmp_path: Path):
    git_hooks_dir = tmp_path / ".git" / "hooks"
    git_hooks_dir.mkdir(parents=True)
    result = runner.invoke(app, ["install-hook", str(tmp_path)])
    assert result.exit_code == 0
    assert (git_hooks_dir / "pre-commit").exists()
