# Speedometer Gauge - User Guide

## What Changed?

The Brand Alignment Score section now features an animated **speedometer gauge** instead of a plain number display. This provides intuitive visual feedback about your content's brand alignment.

## Understanding the Speedometer

### Color Zones

```
   0 ━━━━━ 40         40 ━━━━━ 70         70 ━━━━━ 85         85 ━━━━━ 100
    🔴 RED             🟠 ORANGE           🟡 YELLOW           🟢 GREEN
   MISALIGNED         NEEDS WORK          GOOD ENOUGH          ALIGNED
```

### Reading the Gauge

The speedometer works just like a car speedometer:

1. **Needle Position** - Shows your current score (0-100)
2. **Color of Needle** - Indicates which zone you're in
3. **Status Label** - Displays zone name below center (Red/Orange/Yellow/Green)
4. **Tick Marks** - Reference points at 0, 25, 50, 75, 100

### What Each Zone Means

| Zone | Score | Meaning | Action |
|------|-------|---------|--------|
| 🔴 Red | 0-40 | Content is misaligned with brand guidelines | Major revisions needed |
| 🟠 Orange | 40-70 | Content needs significant improvements | Substantial review required |
| 🟡 Yellow | 70-85 | Content is mostly aligned but has issues | Minor adjustments needed |
| 🟢 Green | 85-100 | Content aligns well with brand guidelines | Light review sufficient |

## How It Works

### When You Click "Analyze Content"

1. The analysis runs on your text
2. The speedometer needle **smoothly animates** from its current position to your new score
3. The needle color **changes dynamically** as it moves through different zones
4. Below the gauge, you see the **detailed breakdown** of individual scores

### Individual Scores

Below the speedometer, you still see three detailed metrics:

- **Internal Brand** - Tone, language, technical accuracy
- **External/Cultural** - Market appropriateness, cultural sensitivity
- **Asset Type** - Format-specific guidelines (email, slide, image, etc.)

These scores are averaged to create the **overall speedometer score**.

### Risk Badge

The colored badge below the scores shows your approval status:

- **Red** - Escalation required, may need regulatory/sustainability review
- **Yellow** - Standard review needed (1-2 approvers)
- **Green** - Light review sufficient, well-aligned with brand

## Tips for Better Scores

### To Move Into the Green (85+)

1. ✓ Use clear, specific language (avoid vague superlatives)
2. ✓ Back up any environmental claims with data
3. ✓ Follow tone of voice guidelines for your market
4. ✓ Ensure technical claims are accurate
5. ✓ Consider cultural norms for your target audience

### Common Issues Detected

The analysis flags:

- Hype language ("revolutionary," "game-changing," "super")
- Unsubstantiated green claims
- Misleading legal statements
- Incorrect technical specifications
- Culturally insensitive content
- Missing required disclaimers

### Use the Suggested Edits

After analysis, the "Suggested Edits" section shows hints inline:

```
Original:  "We offer super cheap eco-friendly solutions"
Suggested: "We offer affordable sustainable solutions"
```

Click "Apply Hints" to accept these suggestions.

## Features

### Smooth Animation
The needle animates smoothly over 1.2 seconds when scores update, making score changes clear and satisfying.

### Color Feedback
The needle, tick marks, and status label all change color based on your zone, providing multiple visual cues.

### Glowing Effect
The gauge has a subtle glow effect that intensifies during updates, drawing attention to score changes.

### Hover Enhancement
When you hover over the speedometer on desktop, the glow intensifies slightly, showing it's interactive.

## Troubleshooting

### Gauge Not Showing?
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### Scores Not Updating?
- Click "Analyze Content" button
- Ensure you have content to analyze
- Wait for the animation to complete (1.2 seconds)

### Unexpected Zone Color?
- Check the detailed scores below the gauge
- Review the flagged issues in "Issues & Feedback"
- Use suggested edits to improve alignment

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter** - Run analysis (triggers speedometer update)
- **Ctrl/Cmd + S** - Export results

## Mobile Experience

The speedometer works great on mobile devices too:
- Touch to interact
- Responsive sizing adapts to screen width
- All animations remain smooth

## Example Workflows

### Workflow 1: Quick Check
1. Paste or upload content
2. Click "Analyze Content"
3. Watch speedometer update
4. Check if you're in Green zone
5. If not, review Issues & apply Suggestions

### Workflow 2: Iterative Improvement
1. Run analysis (watch speedometer)
2. Read "Issues & Feedback"
3. Review "Suggested Edits"
4. Click "Apply Hints" to update content
5. Run analysis again
6. Watch speedometer improve with each iteration

### Workflow 3: Export & Share
1. Run analysis to get speedometer score
2. Review all metrics (individual scores + risk badge)
3. Click "Export Results" to save JSON
4. Share results with reviewers

## Understanding the Detailed Scores

Below the speedometer are three component scores:

### Internal Brand (0-100)
Evaluates:
- Tone and language consistency
- Technical accuracy
- Brand terminology use
- Legal compliance

### External/Cultural (0-100)
Evaluates:
- Sustainability claim backing
- Cultural appropriateness by market
- Regulatory compliance
- Market-specific sensitivities

### Asset Type (0-100)
Evaluates:
- Email guidelines
- Presentation standards
- Document formatting
- Image requirements
- Social media rules

**Overall Score** = Average of these three scores

## Color Accessibility

The speedometer uses multiple visual indicators beyond color:

- **Needle position** - Shows score numerically
- **Zone labels** - Text shows zone name (Red/Orange/Yellow/Green)
- **Tick marks** - Positional reference
- **Score numbers** - Displayed digitally below gauge

This ensures the gauge is interpretable even with color blindness or in print.

## Advanced: Understanding Score Penalties

Each flagged issue reduces your score:

- Critical issues: -20 to -30 points
- Warning issues: -10 to -15 points
- Info issues: -5 to -10 points

Maximum score starts at 100, decreases with each violation, minimum is 0.

Example:
- Start: 100 points
- Found unsubstantiated green claim: -20 points
- Found hype language: -10 points
- Found cultural insensitivity: -15 points
- **Final Score: 55 points** (Orange zone)

Fix the three issues, re-analyze, and your score improves!

---

**Need Help?** Check the "Issues & Feedback" section for specific problems detected in your content.
