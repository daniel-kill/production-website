import json
from pathlib import Path

from secret_sentinel.scanner import Finding


def generate_sarif_report(findings: list[Finding]) -> str:
    """Generate a standard SARIF v2.1.0 JSON report compatible with GitHub Security."""
    sarif_data = {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [
            {
                "tool": {
                    "driver": {
                        "name": "Secret Sentinel",
                        "informationUri": "https://github.com/daniel-kill/secret-sentinel",
                        "version": "0.1.0",
                        "rules": [
                            {
                                "id": "SEC001",
                                "name": "ExposedCredentialOrSecret",
                                "shortDescription": {
                                    "text": (
                                        "Potential hardcoded secret or sensitive token detected."
                                    )
                                },
                                "defaultConfiguration": {
                                    "level": "error"
                                }
                            }
                        ]
                    }
                },
                "results": [
                    {
                        "ruleId": "SEC001",
                        "message": {
                            "text": (
                                f"Secret detected [{finding.rule_name}] with entropy "
                                f"{finding.entropy}: {finding.secret_preview}"
                            )
                        },
                        "locations": [
                            {
                                "physicalLocation": {
                                    "artifactLocation": {
                                        "uri": Path(finding.file_path).as_posix()
                                    },
                                    "region": {
                                        "startLine": finding.line_number
                                    }
                                }
                            }
                        ]
                    }
                    for finding in findings
                ]
            }
        ]
    }
    return json.dumps(sarif_data, indent=2)
