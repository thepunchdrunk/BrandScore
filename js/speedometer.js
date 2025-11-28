/**
 * Speedometer Gauge Component
 * Renders an animated speedometer-style gauge for brand alignment scores.
 * @module speedometer
 */

class SpeedometerGauge {
  /**
   * Creates a new SpeedometerGauge instance
   * @param {string} containerId - ID of the container element
   * @param {Object} options - Configuration options
   */
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.options = {
      size: options.size || 200,
      maxScore: options.maxScore || 100,
      animated: options.animated !== false,
      ...options
    };

    this.currentScore = 0;
    this.canvasId = `speedometer-canvas-${Date.now()}`;
    this._initialize();
  }

  /**
   * Initialize the gauge
   * @private
   */
  _initialize() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center justify-center gap-4">
        <canvas 
          id="${this.canvasId}" 
          width="${this.options.size}" 
          height="${this.options.size}"
          class="drop-shadow-lg">
        </canvas>
        <div class="text-center">
          <div class="text-4xl font-bold text-brand-300" id="${this.canvasId}-score">0</div>
          <div class="text-xs text-slate-400 mt-1">Brand Alignment Score</div>
        </div>
      </div>
    `;
  }

  /**
   * Animates the gauge to a new score
   * @param {number} score - Target score (0-100)
   * @param {number} duration - Animation duration in ms
   */
  animate(score, duration = 1000) {
    if (!this.options.animated) {
      this.setScore(score);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startScore = this.currentScore;
      const startTime = Date.now();
      const animationFrames = [];

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentScore = startScore + (score - startScore) * easeProgress;
        
        this.setScore(currentScore);

        if (progress < 1) {
          animationFrames.push(requestAnimationFrame(animate));
        } else {
          this.setScore(score);
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * Sets the score without animation
   * @param {number} score - Score value (0-100)
   */
  setScore(score) {
    this.currentScore = Math.max(0, Math.min(score, 100));
    this._draw();
    
    const scoreElement = document.getElementById(`${this.canvasId}-score`);
    if (scoreElement) {
      scoreElement.textContent = Math.round(this.currentScore);
    }
  }

  /**
   * Gets the color based on score value
   * @private
   */
  _getColor(score) {
    if (score >= 85) {
      return { needle: '#10b981', background: 'rgba(16, 185, 129, 0.1)', label: 'Green' };
    } else if (score >= 70) {
      return { needle: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', label: 'Yellow' };
    } else if (score >= 50) {
      return { needle: '#f97316', background: 'rgba(249, 115, 22, 0.1)', label: 'Orange' };
    } else {
      return { needle: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', label: 'Red' };
    }
  }

  /**
   * Draws the speedometer gauge
   * @private
   */
  _draw() {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = this.options.size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.85;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw gauge arc (0-100 scale, 180 degrees)
    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;
    const scoreAngle = startAngle + ((endAngle - startAngle) * (this.currentScore / 100));

    // Draw colored segments behind the gauge
    this._drawGaugeSegments(ctx, centerX, centerY, radius);

    // Draw outer ring with ticks
    this._drawTicks(ctx, centerX, centerY, radius);

    // Get color based on current score
    const color = this._getColor(this.currentScore);

    // Draw progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 12, startAngle, scoreAngle, false);
    ctx.strokeStyle = color.needle;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw glowing effect
    ctx.shadowColor = color.needle;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw needle
    const needleAngle = scoreAngle;
    const needleLength = radius * 0.75;
    const needleX = centerX + Math.cos(needleAngle - Math.PI / 2) * needleLength;
    const needleY = centerY + Math.sin(needleAngle - Math.PI / 2) * needleLength;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.strokeStyle = color.needle;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = color.needle;
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw center glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.strokeStyle = color.needle + '33';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw status label below center
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = color.needle;
    ctx.textAlign = 'center';
    ctx.fillText(color.label, centerX, centerY + radius + 15);
  }

  /**
   * Draws gauge segments with different colors
   * @private
   */
  _drawGaugeSegments(ctx, centerX, centerY, radius) {
    const segments = [
      { range: [0, 40], color: 'rgba(239, 68, 68, 0.2)' },
      { range: [40, 70], color: 'rgba(249, 115, 22, 0.2)' },
      { range: [70, 85], color: 'rgba(245, 158, 11, 0.2)' },
      { range: [85, 100], color: 'rgba(16, 185, 129, 0.2)' }
    ];

    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;
    const totalRange = 100;

    segments.forEach(segment => {
      const segStart = startAngle + ((endAngle - startAngle) * (segment.range[0] / totalRange));
      const segEnd = startAngle + ((endAngle - startAngle) * (segment.range[1] / totalRange));

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 12, segStart, segEnd, false);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }

  /**
   * Draws tick marks and labels
   * @private
   */
  _drawTicks(ctx, centerX, centerY, radius) {
    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;

    // Draw major ticks every 10 points
    for (let i = 0; i <= 100; i += 10) {
      const angle = startAngle + ((endAngle - startAngle) * (i / 100));
      const tickLengthMajor = 12;
      const tickLengthMinor = 6;

      // Major ticks
      const x1 = centerX + Math.cos(angle) * (radius - tickLengthMajor);
      const y1 = centerY + Math.sin(angle) * (radius - tickLengthMajor);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw labels (0, 25, 50, 75, 100)
      if (i % 25 === 0) {
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const labelDist = radius - 28;
        const labelX = centerX + Math.cos(angle) * labelDist;
        const labelY = centerY + Math.sin(angle) * labelDist;
        ctx.fillText(i, labelX, labelY);
      }

      // Minor ticks
      if (i < 100) {
        for (let j = 1; j < 10; j += 2) {
          const minorAngle = angle + ((endAngle - startAngle) / 100) * j;
          const mx1 = centerX + Math.cos(minorAngle) * (radius - tickLengthMinor);
          const my1 = centerY + Math.sin(minorAngle) * (radius - tickLengthMinor);
          const mx2 = centerX + Math.cos(minorAngle) * radius;
          const my2 = centerY + Math.sin(minorAngle) * radius;

          ctx.beginPath();
          ctx.moveTo(mx1, my1);
          ctx.lineTo(mx2, my2);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  /**
   * Destroys the gauge
   */
  destroy() {
    this.container.innerHTML = '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpeedometerGauge;
}
