param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$targetDir = Join-Path $PSScriptRoot "SIH-26\hermes-agent"
& uv run --directory $targetDir hermes @Arguments
