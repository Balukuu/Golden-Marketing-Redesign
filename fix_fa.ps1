$path = 'services\field-activations.html'
$c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Fix the footer that got mangled with \u003c literal escapes
$c = $c -replace '\\u003cspan\\u003e[^\\]+\\u003c/span\\u003e\s*Bugolobi', '<span>📍</span> Bugolobi'
$c = $c -replace '\\u003cspan\\u003e[^\\]+\\u003c/span\\u003e\s*\+256', '<span>📞</span> +256'
$c = $c -replace '\\u003cspan\\u003e[^\\]+\\u003c/span\\u003e\s*office@', '<span>📧</span> office@'

# Fix submit button garbled arrow
$c = $c -replace 'Request Activation Proposal[^<]{1,20}(?=</button)', 'Request Activation Proposal 🚀'

# Fix tab button icons - replace anything between <span class="tab-icon"> and </span>
$c = $c -replace '(?<=<span class="tab-icon">)[^<]{1,15}(?=</span>Consumer)', '🎁'
$c = $c -replace '(?<=<span class="tab-icon">)[^<]{1,15}(?=</span>Experiential)', '✨'
$c = $c -replace '(?<=<span class="tab-icon">)[^<]{1,15}(?=</span>Road)', '🚌'
$c = $c -replace '(?<=<span class="tab-icon">)[^<]{1,15}(?=</span>Trade)', '🏪'

# Fix tp-icons (tab point icons) - replace all garbled tp-icon spans
$c = $c -replace '(?<=<span class="tp-icon">)[^<]{1,15}(?=</span>)', '✅'

# Fix modal close buttons
$c = $c -replace '(?<=<button class="modal-close"[^>]*>)[^<]{1,10}(?=</button)', '✕'

[System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
Write-Host "Done"
