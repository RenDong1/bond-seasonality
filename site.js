/* 债市投资策略平台，图表主题
 * 在 <head> 末尾同步加载（在页面自己的 ECharts 代码之前）。
 * 作用：不改各页图表选项的前提下，统一图表文字、网格、提示框与色板。
 * 只改样式键，不动 grid/坐标范围等几何设置。
 */
(function () {
  /* 图表用“加深刻”：同一色相保留，但压深到纸上 ≥4.5:1，
     细线和小标记不再发灰发淡（2026-10-28 对比度修订）。 */
  var C = {
    violet: '#5D4C68', green: '#5A7448', air: '#3E6B8C',
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
    /* 本站五色板自身也压深一档，避免细线在纸面上发虚 */
    '#769365': C.green, '#749ab2': C.air,
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

/* 术语与口径弹层：全站页脚「术语与口径」按钮，内容不随页面变化。 */
(function () {
  var TERMS = [
    ['收益率与 bp', '债券收益率以 % 表示，1bp = 0.01 个百分点。收益率下行代表债券价格上涨，本站按「利好」处理。'],
    ['期限利差', '同一天两只债券收益率的差，单位 bp。30Y–10Y 利差走扩常对应曲线陡峭化，压缩对应平坦化。'],
    ['压缩 / 走扩', '利差压缩 = 长端相对短端下行更多，利好长久期；走扩则相反。首页与股债联动的方向色按此口径。'],
    ['DR001', '银行间存款类机构隔夜质押式回购加权平均利率，反映银行体系隔夜资金价格，单位为 %。'],
    ['点测久期', '用当日复权净值增长率除以当日收益率变动，反推组合的利率敏感度，单位「年」。数值越大，对收益率变动越敏感。'],
    ['分位', '当前值在所选历史区间内的百分位。80% 分位表示历史上只有 20% 的时间高于当前水平，不代表一定回落。'],
    ['胜率 / 盈亏比', '胜率 = 方向正确的样本占比；盈亏比 = 盈利样本合计 ÷ 亏损样本合计。样本量小时两者都不稳定。'],
    ['CTD', '最便宜可交割债券（Cheapest to Deliver），国债期货交割时卖方成本最低的券，是期现定价的锚。'],
    ['IRR', '隐含回购利率（Implied Repo Rate），买入 CTD、卖出期货并持有到交割的隐含收益率。'],
    ['净基差 BNOC', '基差扣除持有收益后的部分，衡量期货相对现券的定价偏离；BNOC 为正通常表示期货偏贵。'],
    ['基差 / 期现价差', '现券价格与期货价格（经转换因子调整）的差。本站期现关系区数据源暂不提供 CTD 与现券行情，保留占位。'],
    ['VPIN', '成交量同步知情交易概率（Volume-Synchronized Probability of Informed Trading），用买卖成交量失衡近似订单流毒性；数值越高，流动性越脆弱。'],
    ['相对增仓', 'TL 持仓量增速减去 T 持仓量增速。为正表示资金相对更集中到超长端，用于判断期限偏好迁移。'],
    ['翻号持有 / 固定持有', '翻号持有 = 信号同号段持有，翻转后次日离场；固定持有 = 多空各锁 h 个交易日，中性不打断、反向立即翻仓。'],
    ['信号方向', '站点统一：多 / 看多 / 净买入为正 = 红，空 / 看空 / 净卖出 = 绿。仅表示模型方向，不构成投资建议。']
  ];
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var opens = document.querySelectorAll('.glossary-open');
    if (!opens.length) return;
    var dlg = document.createElement('dialog');
    dlg.className = 'glossary-dialog';
    dlg.setAttribute('aria-label', '术语与口径');
    var dl = TERMS.map(function (t) {
      return '<dt>' + t[0] + '</dt><dd>' + t[1] + '</dd>';
    }).join('');
    dlg.innerHTML = '<div class="glossary-head"><h2>术语与口径</h2>' +
      '<button class="glossary-close" type="button">关闭</button></div>' +
      '<div class="glossary-body"><dl>' + dl + '</dl>' +
      '<p class="g-note">各页图表与统计的具体窗口、样本和计算方式，以页面内说明为准。' +
      '本站为研究展示，不构成投资建议。</p></div>';
    document.body.appendChild(dlg);
    function open() {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
    function close() {
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.removeAttribute('open');
    }
    for (var i = 0; i < opens.length; i++) opens[i].addEventListener('click', open);
    dlg.querySelector('.glossary-close').addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  });
})();
