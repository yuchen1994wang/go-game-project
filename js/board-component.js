/**
 * 公共棋盘组件
 * 提供统一的棋盘渲染、落子、坐标转换等功能
 */
class BoardComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`容器 #${containerId} 不存在`);
    }

    this.size = options.size || 19;
    this.cellSize = options.cellSize || 40;
    this.padding = options.padding || 30;
    this.showCoordinates = options.showCoordinates !== false;
    this.showMoveNumbers = options.showMoveNumbers || false;
    this.onIntersectionClick = options.onIntersectionClick || null;
    this.onIntersectionHover = options.onIntersectionHover || null;

    this.letters = 'ABCDEFGHJKLMNOPQRST';
    this.stones = new Map(); // key: "x,y", value: {player, moveNumber}
    this.lastMove = null;

    this.init();
  }

  init() {
    this.renderBoard();
    this.renderGrid();
    this.renderStarPoints();
    if (this.showCoordinates) {
      this.renderCoordinates();
    }
    this.renderIntersections();
    this.bindEvents();
  }

  renderBoard() {
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    this.container.style.width = `${boardSize}px`;
    this.container.style.height = `${boardSize}px`;
    this.container.style.position = 'relative';
    this.container.innerHTML = '';
  }

  renderGrid() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'board-grid');
    svg.setAttribute('width', boardSize);
    svg.setAttribute('height', boardSize);
    svg.setAttribute('viewBox', `0 0 ${boardSize} ${boardSize}`);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';

    for (let i = 0; i < this.size; i++) {
      const pos = this.padding + i * this.cellSize;

      const hLine = document.createElementNS(svgNS, 'line');
      hLine.setAttribute('class', 'grid-line');
      hLine.setAttribute('x1', this.padding);
      hLine.setAttribute('y1', pos);
      hLine.setAttribute('x2', boardSize - this.padding);
      hLine.setAttribute('y2', pos);
      hLine.setAttribute('stroke', 'var(--line-color)');
      hLine.setAttribute('stroke-width', '1');
      hLine.setAttribute('opacity', '0.7');
      svg.appendChild(hLine);

      const vLine = document.createElementNS(svgNS, 'line');
      vLine.setAttribute('class', 'grid-line');
      vLine.setAttribute('x1', pos);
      vLine.setAttribute('y1', this.padding);
      vLine.setAttribute('x2', pos);
      vLine.setAttribute('y2', boardSize - this.padding);
      vLine.setAttribute('stroke', 'var(--line-color)');
      vLine.setAttribute('stroke-width', '1');
      vLine.setAttribute('opacity', '0.7');
      svg.appendChild(vLine);
    }

    this.container.appendChild(svg);
  }

  renderStarPoints() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const starPoints = this.getStarPoints();
    
    starPoints.forEach(([x, y]) => {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('class', 'star-point');
      circle.setAttribute('cx', this.padding + x * this.cellSize);
      circle.setAttribute('cy', this.padding + y * this.cellSize);
      circle.setAttribute('r', this.size === 9 ? 4 : 3);
      circle.setAttribute('fill', 'var(--line-color)');
      circle.style.pointerEvents = 'none';
      this.container.appendChild(circle);
    });
  }

  renderCoordinates() {
    const coords = ['top', 'bottom', 'left', 'right'];
    coords.forEach(position => this.renderCoordinateLabels(position));
  }

  renderCoordinateLabels(position) {
    const boardSize = this.cellSize * (this.size - 1) + this.padding * 2;
    const container = document.createElement('div');
    container.className = `board-coords coord-${position}`;
    
    for (let i = 0; i < this.size; i++) {
      const label = document.createElement('span');
      label.className = 'coord-label';
      
      if (position === 'top' || position === 'bottom') {
        label.textContent = this.letters[i] || '';
      } else {
        label.textContent = this.size - i;
      }
      
      container.appendChild(label);
    }
    
    this.container.appendChild(container);
  }

  renderIntersections() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const intersection = document.createElement('div');
        intersection.className = 'intersection';
        intersection.dataset.x = x;
        intersection.dataset.y = y;
        intersection.style.cssText = `
          position: absolute;
          width: ${this.cellSize}px;
          height: ${this.cellSize}px;
          left: ${this.padding + x * this.cellSize - this.cellSize / 2}px;
          top: ${this.padding + y * this.cellSize - this.cellSize / 2}px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        `;
        
        this.container.appendChild(intersection);
      }
    }
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const intersection = e.target.closest('.intersection');
      if (intersection && this.onIntersectionClick) {
        const x = parseInt(intersection.dataset.x);
        const y = parseInt(intersection.dataset.y);
        this.onIntersectionClick(x, y);
      }
    });

    this.container.addEventListener('mouseover', (e) => {
      const intersection = e.target.closest('.intersection');
      if (intersection && this.onIntersectionHover) {
        const x = parseInt(intersection.dataset.x);
        const y = parseInt(intersection.dataset.y);
        this.onIntersectionHover(x, y);
      }
    });
  }

  getStarPoints() {
    const points = [];
    if (this.size === 9) {
      points.push([2, 2], [2, 6], [4, 4], [6, 2], [6, 6]);
    } else if (this.size === 13) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          points.push([3 + i * 3, 3 + j * 3]);
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          points.push([3 + i * 6, 3 + j * 6]);
        }
      }
    }
    return points;
  }

  placeStone(x, y, player, moveNumber = null) {
    const key = `${x},${y}`;
    this.stones.set(key, { player, moveNumber });
    
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (!intersection) return;

    // 清除该位置已有的棋子
    const existingStone = intersection.querySelector('.stone');
    if (existingStone) {
      existingStone.remove();
    }

    const stone = document.createElement('div');
    stone.className = `stone ${player === 1 ? 'black' : 'white'}`;
    stone.style.cssText = `
      width: ${this.cellSize * 0.9}px;
      height: ${this.cellSize * 0.9}px;
      border-radius: 50%;
      position: absolute;
      transform: scale(0);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 20;
      ${player === 1 
        ? 'background: radial-gradient(circle at 30% 30%, var(--stone-black-highlight), var(--stone-black) 60%); box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.4);'
        : 'background: radial-gradient(circle at 30% 30%, #ffffff, var(--stone-white) 50%, var(--stone-white-shadow) 100%); box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1);'
      }
    `;

    if (this.showMoveNumbers && moveNumber) {
      const num = document.createElement('span');
      num.className = 'move-number';
      num.textContent = moveNumber;
      num.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
        z-index: 25;
        pointer-events: none;
        color: ${player === 1 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'};
      `;
      stone.appendChild(num);
    }

    intersection.appendChild(stone);
    
    // 动画显示
    requestAnimationFrame(() => {
      stone.style.transform = 'scale(1)';
    });

    // 更新最后落子标记
    this.updateLastMove(x, y);
  }

  removeStone(x, y) {
    const key = `${x},${y}`;
    this.stones.delete(key);
    
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (intersection) {
      const stone = intersection.querySelector('.stone');
      if (stone) {
        stone.style.transform = 'scale(0)';
        setTimeout(() => stone.remove(), 200);
      }
    }
  }

  updateLastMove(x, y) {
    // 清除之前的最后落子标记
    if (this.lastMove) {
      const prevIntersection = this.container.querySelector(
        `.intersection[data-x="${this.lastMove.x}"][data-y="${this.lastMove.y}"]`
      );
      if (prevIntersection) {
        const prevStone = prevIntersection.querySelector('.stone');
        if (prevStone) {
          prevStone.classList.remove('last-move');
          const marker = prevStone.querySelector('.last-move-marker');
          if (marker) marker.remove();
        }
      }
    }

    // 添加新的最后落子标记
    const intersection = this.container.querySelector(`.intersection[data-x="${x}"][data-y="${y}"]`);
    if (intersection) {
      const stone = intersection.querySelector('.stone');
      if (stone) {
        stone.classList.add('last-move');
        
        const marker = document.createElement('div');
        marker.className = 'last-move-marker';
        marker.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-red);
          box-shadow: 0 0 4px rgba(196, 30, 58, 0.6);
          z-index: 30;
        `;
        stone.appendChild(marker);
      }
    }

    this.lastMove = { x, y };
  }

  clearBoard() {
    this.stones.clear();
    this.lastMove = null;
    this.container.querySelectorAll('.stone').forEach(stone => {
      stone.style.transform = 'scale(0)';
      setTimeout(() => stone.remove(), 200);
    });
  }

  getStone(x, y) {
    return this.stones.get(`${x},${y}`) || null;
  }

  hasStone(x, y) {
    return this.stones.has(`${x},${y}`);
  }

  destroy() {
    this.container.innerHTML = '';
    this.stones.clear();
    this.lastMove = null;
  }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardComponent;
}
