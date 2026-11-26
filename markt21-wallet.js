/* MARKT V21 — Wallet & History */

(() => {
  'use strict';

  const origin =
    'https://markt-server.bazenovv1975.workers.dev';

  const byId = id => document.getElementById(id);

  const button = byId('balanceBtn');

  if (
    !button ||
    typeof showSheet !== 'function' ||
    typeof cloudRaw !== 'function'
  ) return;

  if (button.dataset.wallet21 === '1') return;

  button.dataset.wallet21 = '1';

  button.setAttribute(
    'aria-label',
    'Баланс MARKT'
  );

  // DESIGN

  const style = document.createElement('style');

  style.textContent = `

    .mw21 {
      display: grid;
      gap: 14px;
    }

    .mw21-hero {
      position: relative;
      overflow: hidden;
      text-align: center;
      display: grid;
      justify-items: center;
      gap: 5px;
      padding: 26px 15px 23px;
      border: 1px solid #d1a44b32;
      border-radius: 22px;
      background:
        radial-gradient(
          ellipse at 50% 15%,
          #64491d66,
          transparent 70%
        ),
        #1a1917;
    }

    .mw21-hero .ico {
      width: 80px;
      height: 80px;
      filter:
        drop-shadow(0 5px 16px #e8a62a35);
    }

    .mw21-value {
      font-size: 36px;
      line-height: 1.2;
      font-weight: 750;
      letter-spacing: -.04em;
      color: #ffdb72;
      overflow-wrap: anywhere;
      max-width: 100%;
      font-variant-numeric: tabular-nums;
    }

    .mw21-caption {
      color: #b7b0a3;
      font-size: 13px;
    }

    .mw21-card {
      padding: 15px;
      border-radius: 18px;
      background: #1b1b1b;
      border: 1px solid #ffffff10;
      display: grid;
      gap: 10px;
    }

    .mw21-card h3 {
      font-size: 16px;
    }

    .mw21-card p {
      color: #b8b8b8;
      font-size: 13px;
      line-height: 1.55;
    }

    .mw21-status {
      font-size: 12px;
      color: #c2bba9;
      margin-top: 2px;
    }

    .mw21-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #ffffff0e;
    }

    .mw21-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .mw21-row small {
      display: block;
      color: #a0a0a0;
      font-size: 12px;
      margin-top: 3px;
    }

    .mw21-amount {
      font-weight: 700;
      color: #ffdb72;
      white-space: nowrap;
    }

    .mw21-disabled {
      width: 100%;
      min-height: 44px;
      border-radius: 100px;
      background: #303030;
      color: #bcbcbc;
      font-weight: 700;
      opacity: 1 !important;
    }

    .mw21-note {
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }

  `;

  document.head.append(style);

  let balance = null;
  let orders = null;

  let walletMessage =
    'Открой MARKT через бота.';

  let historyMessage =
    'История недоступна.';

  let accountData = '';
  let serial = 0;
  let controller = null;

  const formatted = n =>
    n.toLocaleString('ru-RU');

  const launch = () =>
    location.origin === origin
      ? cloudRaw()
      : '';

  const statuses = {
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    cancelled: 'Отменён',
    refunded: 'Возврат'
  };

  function text(id, value) {
    const el = byId(id);

    if (el && el.textContent !== value) {
      el.textContent = value;
    }
  }

  // RENDER BALANCE

  function paint() {
    const value =
      balance === null
        ? '—'
        : formatted(balance);

    text('balance', value);
    text('profileStars', value);
    text('mw21-value', value);
    text('mw21-status', walletMessage);

    const list = byId('mw21-history');

    if (!list) return;

    list.replaceChildren();

    if (
      !Array.isArray(orders) ||
      orders.length === 0
    ) {
      const msg = document.createElement('p');

      msg.textContent = Array.isArray(orders)
        ? 'Операций пока нет.'
        : historyMessage;

      list.append(msg);
      return;
    }

    for (const order of orders) {
      if (
        !Number.isSafeInteger(order.amount) ||
        order.amount <= 0 ||
        !Object.hasOwn(statuses, order.status) ||
        !Number.isSafeInteger(order.created_at)
      ) continue;

      const date = new Date(
        order.created_at * 1000
      );

      if (!Number.isFinite(date.getTime()))
        continue;

      const row =
        document.createElement('div');

      row.className = 'mw21-row';

      const label =
        document.createElement('div');

      const heading =
        document.createElement('strong');

      heading.textContent =
        statuses[order.status];

      const detail =
        document.createElement('small');

      detail.textContent = date.toLocaleString(
        'ru-RU',
        {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      );

      const amount =
        document.createElement('span');

      amount.className = 'mw21-amount';

      amount.textContent =
        formatted(order.amount) + ' ★';

      label.append(heading, detail);
      row.append(label, amount);
      list.append(row);
    }

    if (!list.childElementCount) {
      const msg = document.createElement('p');

      msg.textContent =
        'Нет доступных операций.';

      list.append(msg);
    }
  }

  // V20 COMPATIBILITY

  if (typeof sync === 'function') {
    const originalSync = sync;

    sync = function (...args) {
      const result =
        originalSync.apply(this, args);

      if (accountData !== launch()) {
        balance = null;
        orders = null;

        walletMessage =
          'Требуется обновление баланса.';

        historyMessage =
          'Требуется обновление истории.';
      }

      paint();

      return result;
    };
  }

  // SERVER CONNECTION

  async function get(path, raw, signal) {
    const response = await fetch(path, {
      method: 'GET',

      headers: {
        'X-Markt-Init': raw
      },

      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      signal
    });

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    return response.json();
  }

  // REFRESH DATA

  async function refresh() {
    const id = ++serial;

    controller?.abort();

    controller = new AbortController();

    const signal = controller.signal;
    const raw = launch();

    if (raw !== accountData) {
      balance = null;
      orders = null;
    }

    accountData = raw;

    if (!raw) {
      balance = null;
      orders = null;

      walletMessage =
        'Открой MARKT через бота во FluxoGram.';

      historyMessage =
        'История доступна после авторизации.';

      paint();
      return;
    }

    balance = null;
    orders = null;

    walletMessage = 'Загрузка баланса…';
    historyMessage = 'Загрузка истории…';

    paint();

    const timeout = setTimeout(() => {
      if (controller && id === serial) {
        controller.abort();
      }
    }, 10000);

    const current = () =>
      id === serial && launch() === raw;

    try {
      await Promise.all([

        get(
          '/api/wallet',
          raw,
          signal
        ).then(data => {

          if (!current()) return;

          if (
            !Number.isSafeInteger(data.balance) ||
            data.balance < 0
          ) {
            throw new Error('balance');
          }

          balance = data.balance;

          walletMessage =
            'Баланс магазина · данные D1';

          paint();

        }).catch(() => {

          if (!current()) return;

          balance = null;

          walletMessage =
            'Не удалось загрузить баланс. ' +
            'Открой приложение заново.';

          paint();
        }),

        get(
          '/api/wallet/history',
          raw,
          signal
        ).then(data => {

          if (!current()) return;

          if (
            !Array.isArray(data.orders) ||
            data.orders.length > 30
          ) {
            throw new Error('history');
          }

          orders = data.orders;

          paint();

        }).catch(() => {

          if (!current()) return;

          orders = null;

          historyMessage =
            'Не удалось загрузить историю операций.';

          paint();

        })

      ]);

    } finally {
      clearTimeout(timeout);
    }
  }

  // OPEN WALLET WINDOW

  button.onclick = () => {

    showSheet('Баланс MARKT', `

      <div class="mw21">

        <div class="mw21-hero">

          ${
            typeof icon === 'function'
              ? icon('balanceStar')
              : '★'
          }

          <div
            class="mw21-value"
            id="mw21-value"
            aria-live="polite"
          >—</div>

          <div class="mw21-caption">
            Stars · баланс магазина
          </div>

          <div
            class="mw21-status"
            id="mw21-status"
            role="status"
          ></div>

        </div>

        <div class="mw21-card">

          <h3>Пополнение баланса</h3>

          <p>
            Приём платежей пока недоступен.
            Мы не списываем Stars
            и не выставляем счета.
          </p>

          <button
            type="button"
            class="mw21-disabled"
            disabled
          >
            Пополнение недоступно
          </button>

        </div>

        <div class="mw21-card">

          <h3>История операций</h3>

          <div
            id="mw21-history"
            aria-live="polite"
          ></div>

        </div>

        <button
          type="button"
          class="secondary full"
          id="mw21-refresh"
        >
          Обновить данные
        </button>

        <p class="mw21-note">
          Баланс магазина не является
          балансом FluxoGram.
        </p>

      </div>

    `);

    byId('mw21-refresh').onclick = refresh;

    paint();
    refresh();
  };

  window.addEventListener(
    'focus',
    refresh
  );

  window.addEventListener(
    'hashchange',
    refresh
  );

  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) {
        refresh();
      } else {
        serial++;
        controller?.abort();

        balance = null;
        orders = null;

        paint();
      }
    }
  );

  refresh();

})();
