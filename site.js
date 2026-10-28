/* 债市投资策略平台，图表主题
 * 在 <head> 末尾同步加载（在页面自己的 ECharts 代码之前）。
 * 作用：不改各页图表选项的前提下，统一图表文字、网格、提示框与色板。
 * 只改样式键，不动 grid/坐标范围等几何设置。
 */
(function () {
  var C = {
    violet: '#5D4C68', green: '#769365', air: '#749AB2',
    columbia: '#C6D6E5', ink: '#42423A', ink2: '#5B5B51',
    muted: '#66665B', grid: '#E7EEF3', rule: '#DFE7ED', paper: '#FFFFFF'
  };
  var FONT = '"Noto Sans SC Web","Noto Sans SC","Source Han Sans SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif';
  var SIZE = 13;

  /* 旧色 → 新色板：紫=主序列/强调，芦笋绿=事件与次序列，气蓝=区间，墨色=文字 */
  var MAP = {
    '#1a237e': C.violet, '#283593': C.violet, '#1565c0': C.violet, '#1d4ed8': C.violet,
    '#2471a3': C.violet, '#5c6bc0': C.violet, '#6a1b9a': C.violet, '#8e24aa': C.violet,
    '#c62828': C.violet, '#b71c1c': C.violet, '#e53935': C.violet,
    '#3b82f6': C.air, '#1976d2': C.air, '#42a5f5': C.air, '#90a4ae': C.air,
    '#ef6c00': C.green, '#f57c00': C.green, '#eb6834': C.green, '#f59e0b': C.green,
    '#2e7d32': C.green, '#1b5e20': C.green, '#10b981': C.green,
    '#26a69a': C.green, '#00897b': C.green, '#00c853': C.green,
    '#1e88e5': C.air,
    /* ECharts 默认色板 → 本站色板 */
    /* #c23531 与 #2e8b57 是金融红涨绿跌，主题不改写 */ '#2f4554': C.air, '#61a0a8': C.green,
    '#d48265': C.green, '#91c7ae': C.green, '#749f83': C.green,
    '#ca8622': C.green, '#bda29a': C.muted, '#6e7074': C.muted,
    '#546570': C.ink2, '#c4ccd3': C.columbia,
    '#999': C.muted, '#888': C.muted, '#666': C.muted, '#607d8b': C.muted,
    '#546e7a': C.ink2, '#333': C.ink, '#222': C.ink,
    '#ddd': C.rule, '#e0e0e0': C.rule, '#cfd8dc': C.rule, '#c5cae9': C.rule,
    '#f0f0f0': C.grid, '#f4f4f4': C.grid, '#f0f2f5': C.grid
  };

  /* 单页覆盖：同一旧色在不同页面的语义不同（如信号评价的策略红是主序列，不是涨跌） */
  var PAGE_MAP = {
    'signal-eval': {
      '#c0392b': C.violet,   /* 策略曲线与柱 */
      '#2471a3': C.air,      /* 等仓位超额 */
      '#e67e22': C.green,    /* vs 全仓 */
      '#7f8c8d': '#7F7F7F',  /* 全仓基准：中性灰 */
      '#e53935': '#C23531',  /* 多头 金融红 */
      '#00c853': '#2E8B57',  /* 空头 金融绿 */
      '#1e88e5': C.air
    }
  };
  /* site.js 在 <head> 执行，此时还没有 body；等首次画图时再取页面标识 */
  var LOCAL = null;
  function localMap() {
    if (!LOCAL) {
      var pg = document.body && document.body.getAttribute('data-page');
      LOCAL = PAGE_MAP[pg || ''] || {};
    }
    return LOCAL;
  }

  function mapColor(v) {
    if (typeof v !== 'string') return v;
    var k = v.toLowerCase().replace(/\s+/g, '');
    return localMap()[k] || MAP[k] || v;
  }

  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) walk(o[i]); return; }

    if (o.axisLabel) {
      o.axisLabel.fontSize = SIZE;
      o.axisLabel.fontFamily = FONT;
      o.axisLabel.color = C.muted;
    }
    if (o.nameTextStyle) { o.nameTextStyle.fontFamily = FONT; o.nameTextStyle.color = C.muted; }
    if (o.textStyle) {
      o.textStyle.fontFamily = FONT;
      if (!o.textStyle.fontSize) o.textStyle.fontSize = SIZE;
      if (!o.textStyle.color) o.textStyle.color = C.muted;
    }
    if (o.splitLine) {
      o.splitLine.lineStyle = o.splitLine.lineStyle || {};
      o.splitLine.lineStyle.color = C.grid;
      o.splitLine.lineStyle.width = 0.5;
    }
    if (o.axisLine) {
      o.axisLine.lineStyle = o.axisLine.lineStyle || {};
      o.axisLine.lineStyle.color = C.rule;
      o.axisLine.lineStyle.width = 0.5;
    }
    if (o.legend) {
      o.legend.textStyle = o.legend.textStyle || {};
      o.legend.textStyle.fontFamily = FONT;
      o.legend.textStyle.fontSize = SIZE;
      o.legend.textStyle.color = C.muted;
      o.legend.itemWidth = o.legend.itemWidth || 14;
      o.legend.itemHeight = o.legend.itemHeight || 2;
    }
    if (o.tooltip) {
      o.tooltip.backgroundColor = C.paper;
      o.tooltip.borderColor = C.rule;
      o.tooltip.borderWidth = 0.5;
      o.tooltip.textStyle = o.tooltip.textStyle || {};
      o.tooltip.textStyle.color = C.ink;
      o.tooltip.textStyle.fontSize = SIZE;
      o.tooltip.textStyle.fontFamily = FONT;
      o.tooltip.extraCssText = (o.tooltip.extraCssText || '') + ';border-radius:0;box-shadow:none;';
    }

    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var v = o[k];
      if (typeof v === 'string') {
        var lk = v.toLowerCase().replace(/\s+/g, '');
        if (localMap()[lk] || MAP[lk]) o[k] = mapColor(v);
      } else if (v && typeof v === 'object') {
        if (k === 'series' && Array.isArray(v)) {
          for (var s = 0; s < v.length; s++) {
            var ser = v[s];
            if (ser && ser.type === 'line') {
              ser.lineStyle = ser.lineStyle || {};
              if (!ser.lineStyle.width) ser.lineStyle.width = 2;
              if (ser.symbolSize === undefined) ser.symbolSize = 8;
            }
          }
        }
        walk(v);
      }
    }
  }

  var charts = [];
  function patch() {
    if (!window.echarts || window.echarts.__sitePatched) return;
    echarts.__sitePatched = true;
    var origInit = echarts.init;
    echarts.init = function (dom, theme, opts) {
      var c = origInit.call(this, dom, theme, opts);
      if (c && !c.__siteWrapped) {
        var origSet = c.setOption.bind(c);
        c.setOption = function (opt, notMerge, lazy) {
          try { walk(opt); } catch (e) { }
          return origSet(opt, notMerge, lazy);
        };
        c.__siteWrapped = true;
        charts.push(c);
      }
      return c;
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        for (var i = 0; i < charts.length; i++) {
          try { charts[i].resize(); } catch (e) { }
        }
      });
    }
  }

  /* 多数页面在 head 里已加载 ECharts；signal-eval 在 body 内联，需稍后补打补丁 */
  patch();
  var tries = 0;
  var timer = setInterval(function () {
    patch();
    if (window.echarts && window.echarts.__sitePatched || ++tries > 500) clearInterval(timer);
  }, 10);
  document.addEventListener('DOMContentLoaded', patch);
})();
