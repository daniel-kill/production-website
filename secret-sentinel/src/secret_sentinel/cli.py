import fnmatch
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table

from secret_sentinel import __version__
from secret_sentinel.hook import install_pre_commit_hook
from secret_sentinel.sarif import generate_sarif_report
from secret_sentinel.scanner import Finding, scan_file

console = Console()
app = typer.Typer(
    name="secret-sentinel",
    help="🛡️ High-Throughput Secret & Security Posture Scanner with Shannon Entropy Analysis.",
    add_completion=False,
)

DEFAULT_IGNORE_DIRS = {
    ".git",
    "venv",
    ".venv",
    "env",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".ruff_cache",
    "dist",
    "build",
    ".egg-info",
}


def load_ignore_patterns(root_path: Path) -> list[str]:
    """Load exclusion patterns from .secretsentinelignore if present."""
    ignore_file = root_path / ".secretsentinelignore"
    if not ignore_file.exists():
        return []
    try:
        lines = ignore_file.read_text(encoding="utf-8").splitlines()
        return [line.strip() for line in lines if line.strip() and not line.startswith("#")]
    except OSError:
        return []


def should_skip_file(file_path: Path, root_path: Path, patterns: list[str]) -> bool:
    """Check if file should be skipped due to ignore rules or directory defaults."""
    # Check default ignored directory names
    for part in file_path.parts:
        if part in DEFAULT_IGNORE_DIRS:
            return True

    # Relative path matching for custom ignore patterns
    try:
        rel_path = file_path.relative_to(root_path).as_posix()
    except ValueError:
        rel_path = file_path.as_posix()

    for pattern in patterns:
        if fnmatch.fnmatch(rel_path, pattern) or fnmatch.fnmatch(file_path.name, pattern):
            return True

    return False


@app.command("scan")
def scan_command(
    path: str = typer.Argument(".", help="Root directory or file to scan for secrets."),
    min_entropy: float = typer.Option(
        3.6,
        "--min-entropy",
        "-e",
        help="Minimum Shannon entropy threshold for generic assignments.",
    ),
    format: str = typer.Option(
        "table",
        "--format",
        "-f",
        help="Output format: 'table' or 'sarif'.",
    ),
    fail_on_secrets: bool = typer.Option(
        True,
        "--fail-on-secrets/--no-fail",
        help="Exit with non-zero status code if secrets are detected.",
    ),
):
    """Scan target path for exposed credentials, API keys, and high-entropy secrets."""
    target = Path(path).resolve()
    if not target.exists():
        console.print(f"[red]Error: Path not found:[/] {target}")
        raise typer.Exit(code=1)

    all_findings: list[Finding] = []
    ignore_patterns = load_ignore_patterns(target if target.is_dir() else target.parent)

    if target.is_file():
        all_findings.extend(scan_file(target, min_entropy=min_entropy))
    else:
        for p in target.rglob("*"):
            if p.is_file() and not should_skip_file(p, target, ignore_patterns):
                all_findings.extend(scan_file(p, min_entropy=min_entropy))

    if format.lower() == "sarif":
        sarif_json = generate_sarif_report(all_findings)
        typer.echo(sarif_json)
    else:
        if not all_findings:
            console.print(
                "[green]✔ Secret Sentinel scan complete: No exposed secrets detected.[/green]"
            )
        else:
            table = Table(
                title=f"🛡️ Secret Sentinel Findings ({len(all_findings)} exposed items)",
                border_style="red",
            )
            table.add_column("Severity", style="bold red")
            table.add_column("Rule Name", style="cyan")
            table.add_column("Location", style="yellow")
            table.add_column("Secret Preview", style="magenta")
            table.add_column("Entropy", justify="right")

            for f in all_findings:
                table.add_row(
                    f.severity,
                    f.rule_name,
                    f"{Path(f.file_path).name}:{f.line_number}",
                    f.secret_preview,
                    f"{f.entropy:.2f}",
                )
            console.print(table)

    if all_findings and fail_on_secrets:
        raise typer.Exit(code=1)


@app.command("install-hook")
def install_hook_command(
    path: str = typer.Argument(
        ".", help="Path to repository where pre-commit hook should be installed."
    )
):
    """Install the Secret Sentinel Git pre-commit hook."""
    repo_path = Path(path).resolve()
    success = install_pre_commit_hook(repo_path)
    if success:
        console.print(
            f"[green]✔ Git pre-commit hook successfully installed in "
            f"{repo_path / '.git' / 'hooks'}[/green]"
        )
    else:
        console.print(
            f"[red]❌ Failed to install hook: '{repo_path}' is not a valid Git "
            f"repository root.[/red]"
        )
        raise typer.Exit(code=1)


def version_callback(value: bool):
    if value:
        typer.echo(f"Secret Sentinel CLI v{__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None,
        "--version",
        "-v",
        callback=version_callback,
        is_eager=True,
        help="Show Secret Sentinel version and exit.",
    )
):
    pass


if __name__ == "__main__":
    app()
