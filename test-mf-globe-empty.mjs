// The globe must stay draggable when there is no traffic: a caption across the
// sphere swallowed the pointer and made rotation impossible.
import fs from 'node:fs'
const results = []
const pass = (n) => { results.push({ n, ok: true }); console.log('PASS  ' + n) }
const fail = (n, d) => { results.push({ n, ok: false, d }); console.log('FAIL  ' + n + ' :: ' + d) }
const ui = fs.readFileSync('src/ui.js', 'utf8')

// G1: the replacement card ships an explicit empty state in the markup, so an
// empty dashboard never renders a blank panel that looks broken.
{
  const markup = /<tbody id="aging-rows">[\s\S]{0,160}<td colspan="5" class="aging-msg">/.test(ui)
  const copy = ui.includes('Nothing to schedule') && ui.includes('Loading items')
  if (markup && copy) pass('G1 aging table ships an explicit loading/empty state')
  else fail('G1', JSON.stringify({ markup, copy }))
}
// G2: the empty overlay is never shown for the no-traffic case
{
  const inert = ui.includes("if (empty) { empty.textContent = ''; empty.style.display = 'none' }")
  if (inert) pass('G2 empty overlay stays hidden and blank')
  else fail('G2', 'overlay toggle not found')
}
// G3: the overlay cannot intercept pointer events, so dragging always works
{
  const passThrough = /\.globe-empty\{[^}]*pointer-events:none/.test(ui)
  if (passThrough) pass('G3 overlay does not block pointer events')
  else fail('G3', 'pointer-events not disabled')
}
// G4: genuine failures still surface a message
{
  const errors = ui.includes('Globe unavailable') && ui.includes('Live globe is off')
  if (errors) pass('G4 real failures still report a reason')
  else fail('G4', 'error messages removed')
}
const passed = results.filter((r) => r.ok).length
console.log('\n==== globe empty state ' + passed + '/' + results.length + ' passed ====')
if (passed !== results.length) process.exit(1)