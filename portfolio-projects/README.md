# Developer Portfolio Projects 🛠️

A curated collection of practical developer tools, system utilities, and automation scripts showcasing clean architecture, command-line design, and system integration across multiple programming languages.

---

## 📂 Project Suite

| Project | Language / Platform | Description | Highlights |
|---|---|---|---|
| [**csharp-file-organizer**](./csharp-file-organizer/) | C# / .NET 8 | Console-based file classification and directory organizer | LINQ queries, file categorization, dry-run simulation mode |
| [**node-log-analyzer**](./node-log-analyzer/) | Node.js | Fast CLI log aggregator and metric reporting tool | Streaming stdin / file parsing, status code metrics, JSON & table output |
| [**powershell-system-health**](./powershell-system-health/) | PowerShell 7 / Windows | Workstation telemetry, hardware metrics, and audit collector | CIM/WMI queries, CPU & RAM load, disk space analysis, JSON export |
| [**shell-safe-backup**](./shell-safe-backup/) | POSIX Shell / Bash | Resilient file archiving and backup synchronization utility | Exit code semantics, error traps, timestamped gzip tarballs |

---

## 🚀 Quick Start Guide

### 1. C# File Organizer
Classify and organize unorganized directory downloads by file type.
```bash
cd csharp-file-organizer
dotnet run -- --target /path/to/directory --dry-run
```

### 2. Node.js Log Analyzer
Analyze web server or application logs in real-time.
```bash
cd node-log-analyzer
node src/log-analyzer.js --file samples/application.log
# Or pipe via stream
cat samples/application.log | node src/log-analyzer.js
```

### 3. PowerShell System Health
Audit workstation CPU, memory, and disk health metrics.
```powershell
cd powershell-system-health
pwsh ./Get-SystemHealth.ps1 -ExportJson -OutputPath ./health-report.json
```

### 4. POSIX Shell Safe Backup
Create timestamped tarball archives with integrity checks.
```bash
cd shell-safe-backup
./backup.sh /path/to/source /path/to/dest
```

---

## 📜 License
MIT License. Created by [Daniel Kill](https://github.com/daniel-kill).
