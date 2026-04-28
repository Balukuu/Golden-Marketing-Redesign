$lines = [System.IO.File]::ReadAllLines('services\merchandising.html', [System.Text.Encoding]::UTF8)
$newLines = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($i -ge 419 -and $i -le 423) {
        # skip lines 420-424 (which are indices 419-423)
        continue
    }
    $newLines += $lines[$i]
}
[System.IO.File]::WriteAllLines('services\merchandising.html', $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Fixed HTML syntax"
