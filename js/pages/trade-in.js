/* ==========================================================
   Trang Thu cũ đổi mới — thu-cu-doi-moi.html
   Định giá online (tham khảo) · quy trình · chính sách thu · gửi yêu cầu
   ========================================================== */

/* ---------- BẢNG GIÁ THU (chủ shop chỉnh tại đây) ----------
   Giá thu = giá cơ sở theo thông số × tình trạng × bảo hành × phụ kiện
   (+ trợ giá lên đời nếu đổi sang sản phẩm mới tại cửa hàng).
   Mọi con số dưới đây là GIÁ MẪU — cập nhật theo giá thị trường thực tế. */
const M = 1e6;
const CPU_MODELS = {
  Intel: {
    'Core i3-10100F': 0.6 * M, 'Core i3-12100F': 1.1 * M, 'Core i5-10400F': 0.9 * M, 'Core i5-11400F': 1.1 * M,
    'Core i5-12400F': 1.6 * M, 'Core i5-13400F': 2.3 * M, 'Core i5-14400F': 2.6 * M, 'Core i5-14600K/KF': 4.0 * M,
    'Core i7-12700K/KF': 3.6 * M, 'Core i7-13700K/KF': 5.2 * M, 'Core i7-14700K/KF': 6.0 * M, 'Core i9-13900K/KF': 7.5 * M,
    'Core i9-14900K/KF': 9.0 * M, 'Core Ultra 5 245K': 4.2 * M, 'Core Ultra 7 265K': 6.2 * M,
  },
  AMD: {
    'Ryzen 5 3600': 0.8 * M, 'Ryzen 5 5600': 1.6 * M, 'Ryzen 5 5600X': 1.8 * M, 'Ryzen 7 5700X': 2.4 * M,
    'Ryzen 7 5800X3D': 4.5 * M, 'Ryzen 5 7500F': 2.5 * M, 'Ryzen 5 7600': 3.0 * M, 'Ryzen 7 7700': 4.4 * M,
    'Ryzen 7 7800X3D': 7.0 * M, 'Ryzen 7 9800X3D': 9.5 * M,
  },
};
const VGA_MODELS = {
  NVIDIA: {
    'GTX 1650': 1.2 * M, 'GTX 1660 Super': 2.0 * M, 'RTX 2060': 2.4 * M, 'RTX 3050': 2.6 * M, 'RTX 3060 12GB': 3.8 * M,
    'RTX 3060 Ti': 4.3 * M, 'RTX 3070': 5.2 * M, 'RTX 3070 Ti': 5.8 * M, 'RTX 3080': 8.0 * M, 'RTX 4060': 5.2 * M,
    'RTX 4060 Ti': 6.5 * M, 'RTX 4070': 9.0 * M, 'RTX 4070 Super': 10.5 * M, 'RTX 4070 Ti Super': 13.0 * M,
    'RTX 4080 Super': 17.0 * M, 'RTX 4090': 30.0 * M,
  },
  AMD: { 'RX 6600': 2.6 * M, 'RX 6700 XT': 4.2 * M, 'RX 7600': 3.8 * M, 'RX 7800 XT': 8.0 * M },
};
const flatModels = (groups) => Object.assign({}, ...Object.values(groups));

const COMMON_FIELDS = [
  { id: 'condition', label: 'Tình trạng ngoại hình', options: { 'Như mới (99%)': 1, 'Đẹp (95%)': 0.92, 'Trầy xước nhẹ': 0.82, 'Trầy nhiều / móp': 0.65 } },
  { id: 'warranty', label: 'Bảo hành còn lại', options: { 'Hết bảo hành': 1, 'Còn dưới 6 tháng': 1.05, 'Còn từ 6 tháng': 1.1 } },
  { id: 'box', label: 'Hộp & phụ kiện', options: { 'Đầy đủ hộp, phụ kiện': 1.03, 'Không hộp / thiếu phụ kiện': 1 } },
];

const TRADE_IN = {
  upgradeBonus: { rate: 0.1, max: 2 * M }, // Trợ giá lên đời: +10%, tối đa 2.000.000đ
  groups: {
    lcd: {
      name: 'Màn hình', icon: 'monitor', img: 'monitor-2.jpg',
      fields: [
        { id: 'size', label: 'Kích thước', options: { '22 - 24 inch': 1.0 * M, '25 inch': 1.2 * M, '27 inch': 1.5 * M, '32 inch': 2.0 * M, '34 inch trở lên': 2.6 * M }, base: true },
        { id: 'res', label: 'Độ phân giải', options: { 'Full HD': 1, '2K QHD': 1.5, 'UWQHD (màn cong rộng)': 1.8, '4K UHD': 2 } },
        { id: 'panel', label: 'Tấm nền', options: { TN: 0.8, VA: 0.9, IPS: 1, 'OLED / QD-OLED': 2.2 } },
        { id: 'hz', label: 'Tần số quét', options: { '60 - 75Hz': 0.85, '100 - 144Hz': 1, '165 - 180Hz': 1.15, '240Hz trở lên': 1.35 } },
      ],
    },
    cpu: {
      name: 'CPU', icon: 'cpu', img: 'cpu-2.jpg',
      fields: [
        { id: 'model', label: 'Mẫu CPU', groups: CPU_MODELS, base: true },
        { id: 'pack', label: 'Hình thức', options: { 'Box (còn hộp, tản zin)': 1.05, 'Tray (chỉ CPU)': 1 } },
      ],
    },
    mainboard: {
      name: 'Mainboard', icon: 'microchip', img: 'mainboard-1.jpg',
      fields: [
        { id: 'chipset', label: 'Chipset', groups: {
          Intel: { 'H410 / H510': 0.4 * M, 'B460 / B560': 0.7 * M, H610: 0.9 * M, 'B660 / B760 DDR4': 1.3 * M, 'B760 DDR5': 1.6 * M, 'Z690 / Z790': 2.8 * M, Z890: 4.0 * M },
          AMD: { 'A320 / A520': 0.4 * M, B450: 0.65 * M, B550: 1.1 * M, A620: 1.0 * M, B650: 2.0 * M, 'X670 / X870': 3.5 * M },
        }, base: true },
        { id: 'form', label: 'Kích thước', options: { 'Micro-ATX': 1, ATX: 1.1, 'Mini-ITX': 1.15 } },
        { id: 'wifi', label: 'Wi-Fi tích hợp', options: { 'Không có Wi-Fi': 1, 'Có Wi-Fi + Bluetooth': 1.1 } },
      ],
    },
    vga: {
      name: 'Card đồ họa', icon: 'circuit-board', img: 'vga-3.jpg',
      fields: [
        { id: 'model', label: 'Mẫu VGA', groups: VGA_MODELS, base: true },
        { id: 'tier', label: 'Dòng sản phẩm', options: { 'Phổ thông (Dual, Ventus, Windforce…)': 1, 'Cao cấp (ROG, TUF, Gaming X, AORUS…)': 1.1 } },
        { id: 'mining', label: 'Lịch sử sử dụng', options: { 'Dùng chơi game / làm việc': 1, 'Từng đào coin': 0.75 } },
      ],
    },
    ram: {
      name: 'RAM', icon: 'memory-stick', img: 'ram-1.jpg',
      fields: [
        { id: 'type', label: 'Chuẩn RAM', options: { DDR4: 30000, DDR5: 45000 }, perGb: true },
        { id: 'size', label: 'Dung lượng', options: { '8GB': 8, '16GB (1 thanh)': 16, '16GB (kit 2×8GB)': 16, '32GB': 32, '64GB': 64 }, gb: true },
        { id: 'bus', label: 'Bus', options: { 'Đến 3200MHz': 1, '3600MHz': 1.05, '4800 - 5600MHz': 1, '6000MHz trở lên': 1.1 } },
        { id: 'rgb', label: 'Đèn LED', options: { 'Không LED': 1, 'Có LED RGB': 1.1 } },
      ],
    },
    pc: {
      name: 'Bộ PC', icon: 'pc-case', img: 'pc-1.jpg',
      fields: [
        { id: 'cpu', label: 'CPU', groups: CPU_MODELS, sum: true },
        { id: 'vga', label: 'Card đồ họa', groups: { 'Không có': { 'Không có VGA rời (dùng iGPU)': 0 }, ...VGA_MODELS }, sum: true },
        { id: 'ram', label: 'RAM', options: { '8GB': 0.35 * M, '16GB': 0.7 * M, '32GB': 1.4 * M, '64GB': 2.8 * M }, sum: true },
        { id: 'ssd', label: 'Ổ cứng', options: { 'SSD 256GB': 0.2 * M, 'SSD 512GB': 0.4 * M, 'SSD 1TB': 0.7 * M, 'SSD 2TB': 1.3 * M }, sum: true },
        { id: 'base', label: 'Mainboard + Nguồn + Case', options: { 'Phổ thông': 1.2 * M, 'Tầm trung': 2.2 * M, 'Cao cấp': 4.0 * M }, sum: true },
      ],
      bundleRate: 0.95, // bộ máy nguyên chiếc: tính 95% tổng linh kiện
    },
  },
};

/* ---------- Chính sách thu (nội dung riêng của Minh Khôi PC) ---------- */
const TRADE_POLICY = {
  lcd: {
    yes: ['Màn hình gaming 144Hz trở lên, màn hình văn phòng IPS phổ biến.', 'Lên hình đều màu, không điểm chết lớn, không hở sáng nặng.', 'Còn đủ chân đế, dây nguồn / adapter và cáp tín hiệu.', 'Còn tem, serial; có hóa đơn hoặc bảo hành là điểm cộng.'],
    no: ['Vỡ, nứt panel, sọc màn, ố vàng hoặc chảy mực.', 'Không xác định được model / serial.', 'Đã thay panel, sửa bo mạch không rõ nguồn gốc.'],
  },
  cpu: {
    yes: ['CPU Intel / AMD từ thế hệ Core 10 / Ryzen 3000 trở lên.', 'Hoạt động ổn định khi chạy kiểm tra tải nặng.', 'Không cong / gãy chân, không trầy mặt tiếp xúc.', 'Còn hộp, tản zin hoặc bảo hành được cộng thêm giá.'],
    no: ['Cong, gãy chân socket hoặc chân CPU; cháy, nứt đế.', 'Đã mài, khắc, tháo nắp (delid) hoặc sửa chữa.', 'Treo máy, lỗi nhân khi kiểm tra.'],
  },
  mainboard: {
    yes: ['Mainboard Intel / AMD chipset phổ biến còn hoạt động tốt.', 'Nhận đủ RAM, VGA, ổ cứng; cổng USB, âm thanh, mạng bình thường.', 'Còn chặn I/O (shield), anten Wi-Fi nếu có.', 'Không rỉ sét, không phồng tụ.'],
    no: ['Chân socket cong / gãy, khe RAM hoặc PCIe hỏng.', 'Cháy, phồng tụ, đứt mạch, rỉ sét nặng.', 'Đã hàn, sửa chữa hoặc nạp BIOS lỗi.'],
  },
  vga: {
    yes: ['VGA NVIDIA / AMD từ GTX 16 / RX 6000 trở lên.', 'Chạy kiểm tra tải nặng ổn định, nhiệt độ và quạt bình thường.', 'Còn tem bảo hành, chưa tháo vít / thay keo không rõ ràng.', 'Có hộp, phụ kiện, hóa đơn là điểm cộng.'],
    no: ['Lỗi hình, artifact, sập nguồn khi tải nặng.', 'Đã thay chip, hàn lại, cong PCB hoặc thiếu linh kiện.', 'Không xuất hình hoặc không xác định được model.'],
  },
  ram: {
    yes: ['RAM PC DDR4 / DDR5 các hãng phổ biến.', 'Nhận đủ dung lượng, chạy đúng bus, test không lỗi.', 'Kit nhiều thanh cùng model được giá tốt hơn.', 'Còn tem, tản nhiệt và LED hoạt động bình thường.'],
    no: ['RAM laptop (SO-DIMM) và RAM server ECC / Registered.', 'Lỗi khi test, cháy chip, mẻ chân.', 'Mất tem, không đọc được thông số.'],
  },
  pc: {
    yes: ['Bộ PC lên nguồn, vào Windows và chạy ổn định.', 'Đủ linh kiện chính: CPU, mainboard, RAM, ổ cứng, nguồn, case.', 'Xác định được model CPU, VGA, mainboard.', 'Gỡ mật khẩu BIOS / Windows để kỹ thuật kiểm tra.'],
    no: ['Không lên nguồn, thiếu linh kiện chính.', 'Linh kiện đã sửa chữa không rõ nguồn gốc, mất tem.', 'Không cung cấp mật khẩu, không cho kiểm tra vận hành.'],
  },
};

const ORDER = ['lcd', 'cpu', 'mainboard', 'vga', 'ram', 'pc'];
const state = { group: 'lcd', values: {}, upgrade: true, result: null };

/* ---------- Tính giá ---------- */
const fieldsOf = (g) => [...TRADE_IN.groups[g].fields, ...COMMON_FIELDS];
const optionValue = (field, key) => (field.groups ? flatModels(field.groups)[key] : field.options[key]);
const roundDown = (n) => Math.max(0, Math.floor(n / 10000) * 10000);

function calculate() {
  const group = TRADE_IN.groups[state.group];
  const v = state.values;
  const missing = fieldsOf(state.group).filter((f) => v[f.id] === undefined || v[f.id] === '');
  if (missing.length) return { error: missing };

  const steps = [];
  let base;
  if (state.group === 'pc') {
    const parts = group.fields.map((f) => [f.label, optionValue(f, v[f.id])]);
    const total = parts.reduce((s, [, n]) => s + n, 0);
    base = total * group.bundleRate;
    steps.push(...parts.filter(([, n]) => n > 0).map(([label, n]) => [label, `+${formatPrice(n)}`]));
    steps.push(['Nguyên bộ (× 95%)', formatPrice(base)]);
  } else if (state.group === 'ram') {
    base = optionValue(group.fields[0], v.type) * optionValue(group.fields[1], v.size) * optionValue(group.fields[2], v.bus) * optionValue(group.fields[3], v.rgb);
    steps.push(['Giá cơ sở theo chuẩn, dung lượng, bus', formatPrice(base)]);
  } else {
    const [baseField, ...factors] = group.fields;
    base = optionValue(baseField, v[baseField.id]);
    steps.push([`Giá cơ sở (${v[baseField.id]})`, formatPrice(base)]);
    factors.forEach((f) => {
      const k = optionValue(f, v[f.id]);
      base *= k;
      if (k !== 1) steps.push([`${f.label}: ${v[f.id]}`, `× ${k}`]);
    });
  }

  let price = base;
  COMMON_FIELDS.forEach((f) => {
    const k = f.options[v[f.id]];
    price *= k;
    if (k !== 1) steps.push([`${f.label}: ${v[f.id]}`, `× ${k}`]);
  });
  price = roundDown(price);
  const bonus = state.upgrade ? roundDown(Math.min(price * TRADE_IN.upgradeBonus.rate, TRADE_IN.upgradeBonus.max)) : 0;
  return { price, bonus, total: price + bonus, steps };
}

function summaryLine() {
  const v = state.values;
  const parts = TRADE_IN.groups[state.group].fields.map((f) => v[f.id]).filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Chưa nhập thông tin';
}

/* ---------- Giao diện ---------- */
function selectHTML(field) {
  const value = state.values[field.id] ?? '';
  const opts = field.groups
    ? Object.entries(field.groups).map(([g, models]) => `<optgroup label="${g}">${Object.keys(models).map((k) => `<option${k === value ? ' selected' : ''}>${k}</option>`).join('')}</optgroup>`).join('')
    : Object.keys(field.options).map((k) => `<option${k === value ? ' selected' : ''}>${k}</option>`).join('');
  return `
    <div class="field">
      <label class="field__label" for="ti-${field.id}">${field.label} <b>*</b></label>
      <select class="input" id="ti-${field.id}" data-field="${field.id}">
        <option value="">Chọn ${field.label.toLowerCase()}…</option>${opts}
      </select>
      <span class="field__error"></span>
    </div>`;
}

function calculatorHTML() {
  const group = TRADE_IN.groups[state.group];
  return `
    <div class="ti-calc__chips" role="tablist" aria-label="Nhóm hàng">
      ${ORDER.map((id) => `<button class="ti-chip${id === state.group ? ' is-active' : ''}" type="button" role="tab" aria-selected="${id === state.group}" data-group="${id}">${icon(TRADE_IN.groups[id].icon)}${TRADE_IN.groups[id].name}</button>`).join('')}
    </div>
    <h3 class="ti-calc__sub">Thông số ${group.name.toLowerCase()}</h3>
    <div class="form-grid form-grid--2">${group.fields.map(selectHTML).join('')}</div>
    <h3 class="ti-calc__sub">Tình trạng sản phẩm</h3>
    <div class="form-grid form-grid--2">${COMMON_FIELDS.map(selectHTML).join('')}</div>
    <label class="ti-upgrade">
      <input type="checkbox" data-upgrade ${state.upgrade ? 'checked' : ''}>
      <span><b>Đổi lên đời tại ${COMPANY.name}</b><small>Trợ giá thêm ${TRADE_IN.upgradeBonus.rate * 100}% (tối đa ${formatPrice(TRADE_IN.upgradeBonus.max)}) khi mua sản phẩm mới cùng lúc</small></span>
    </label>
    <a class="ti-calc__more" href="category.html?cat=${state.group === 'lcd' ? 'monitor' : state.group === 'pc' ? 'pc' : state.group}">${icon('sparkles')}Xem sản phẩm ${group.name.toLowerCase()} mới để lên đời${icon('arrow-right')}</a>`;
}

function summaryHTML() {
  const r = state.result;
  return `
    <div class="ti-sum__head">
      <p class="ti-sum__title">Tóm tắt định giá</p>
      <span class="ti-sum__badge${r ? ' is-done' : ''}">${r ? 'Đã định giá' : 'Chờ thông tin'}</span>
    </div>
    <div class="ti-sum__item">
      <small>${icon(TRADE_IN.groups[state.group].icon)}${TRADE_IN.groups[state.group].name}</small>
      <b>${esc(summaryLine())}</b>
    </div>
    <div class="ti-sum__price">
      <small>Giá thu tối đa (tham khảo)</small>
      <strong>${r ? formatPrice(r.total) : 'Chưa tính giá'}</strong>
      ${r?.bonus ? `<span>Gồm trợ giá lên đời ${formatPrice(r.bonus)}</span>` : ''}
    </div>
    <div class="ti-sum__body">
      ${r ? `
        <ul class="ti-sum__steps">
          ${r.steps.map(([label, val]) => `<li><span>${esc(label)}</span><b>${val}</b></li>`).join('')}
          <li class="is-total"><span>Giá thu thiết bị</span><b>${formatPrice(r.price)}</b></li>
          ${r.bonus ? `<li class="is-bonus"><span>Trợ giá lên đời</span><b>+${formatPrice(r.bonus)}</b></li>` : ''}
        </ul>
        <p class="ti-sum__note">${icon('info')}Giá chốt sau khi kỹ thuật kiểm tra thực tế tại cửa hàng.</p>` : `<p class="ti-sum__hint">Chọn đủ thông số rồi bấm <b>Tính giá</b> để xem chi tiết cách tính.</p>`}
      <div class="ti-sum__actions">
        <button class="btn btn--ghost" type="button" data-reset>${icon('rotate-ccw')}Đặt lại</button>
        <button class="btn btn--primary" type="button" data-calc>${icon('zap')}Tính giá</button>
      </div>
      ${r ? sendFormHTML() : ''}
    </div>`;
}

function sendFormHTML() {
  const profile = Profile.get() || {};
  return `
    <form class="ti-send" id="ti-send" novalidate>
      <p class="ti-send__title">${icon('send')}Gửi định giá cho cửa hàng</p>
      <div class="field"><input class="input" name="name" placeholder="Họ và tên *" value="${esc(profile.name || '')}" autocomplete="name"><span class="field__error"></span></div>
      <div class="field"><input class="input" name="phone" type="tel" placeholder="Số điện thoại *" value="${esc(profile.phone || '')}" autocomplete="tel"><span class="field__error"></span></div>
      <div class="field"><input class="input" name="note" placeholder="Model cụ thể, ghi chú (không bắt buộc)"></div>
      <button class="btn btn--dark btn--block" type="submit">${icon('phone-call')}Nhận tư vấn & báo giá chính xác</button>
    </form>`;
}

function renderCalc() {
  $('#ti-calc-body').innerHTML = calculatorHTML();
  renderSummary();
}

function renderSummary() {
  $('#ti-summary').innerHTML = summaryHTML();
  refreshIcons();
}

function policyHTML() {
  return ORDER.map((id) => `
    <div class="ti-policy__group reveal">
      <h3 class="ti-policy__name">${icon(TRADE_IN.groups[id].icon)}${TRADE_IN.groups[id].name}</h3>
      <div class="ti-policy__cols">
        <div class="ti-policy__card ti-policy__card--yes">
          <p>${icon('circle-check')}Ưu tiên thu mua</p>
          <ul>${TRADE_POLICY[id].yes.map((t) => `<li>${icon('check')}${t}</li>`).join('')}</ul>
        </div>
        <div class="ti-policy__card ti-policy__card--no">
          <p>${icon('circle-x')}Từ chối / thu giá thấp</p>
          <ul>${TRADE_POLICY[id].no.map((t) => `<li>${icon('x')}${t}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('');
}

function render() {
  const tiles = ['lcd', 'vga', 'mainboard', 'cpu'];
  $('#trade-page').innerHTML = `
    ${renderBreadcrumb([['Thu cũ đổi mới', '#']])}

    <section class="ti-hero reveal" aria-labelledby="ti-title">
      <div class="ti-hero__text">
        <p class="ti-eyebrow">${icon('recycle')}Thu cũ đổi mới · ${COMPANY.name}</p>
        <h1 class="ti-hero__title" id="ti-title">Định giá trong 1 phút. <em>Lên đời</em> <strong>trợ giá đến 2 triệu</strong></h1>
        <p class="ti-hero__desc">Thu mua màn hình, CPU, mainboard, card đồ họa, RAM và bộ PC cũ. Nhận tiền mặt, chuyển khoản hoặc trừ thẳng vào đơn hàng mới.</p>
        <div class="ti-hero__actions">
          <a class="btn btn--primary btn--lg" href="#dinh-gia">${icon('calculator')}Định giá ngay</a>
          <a class="btn ti-btn-light btn--lg" href="${COMPANY.zalo}" target="_blank" rel="noopener">${icon('message-circle')}Gửi ảnh qua Zalo</a>
          <a class="btn ti-btn-light btn--lg" href="tel:${COMPANY.phone}">${icon('phone')}${COMPANY.phoneDisplay}</a>
        </div>
        <ul class="ti-hero__perks">
          <li>${icon('badge-check')}Kiểm tra miễn phí</li>
          <li>${icon('banknote')}Thanh toán ngay</li>
          <li>${icon('shield-check')}Xóa dữ liệu an toàn</li>
        </ul>
      </div>
      <div class="ti-hero__tiles">
        ${tiles.map((id) => `
          <button class="ti-tile" type="button" data-pick="${id}">
            <img src="${thumb(IMG + TRADE_IN.groups[id].img)}" alt="" width="200" height="200">
            <span><small>Thu cũ</small><b>${TRADE_IN.groups[id].name}</b></span>
          </button>`).join('')}
      </div>
    </section>

    <section class="ti-calc-wrap section" id="dinh-gia" aria-labelledby="ti-calc-title">
      <div class="panel ti-calc reveal">
        <h2 class="ti-calc__title" id="ti-calc-title">Định giá thu</h2>
        <p class="ti-calc__desc">Chọn nhóm hàng và thông số sản phẩm của bạn để xem giá thu tham khảo.</p>
        <div id="ti-calc-body"></div>
      </div>
      <aside class="ti-sum reveal" id="ti-summary" aria-live="polite"></aside>
    </section>

    <section class="section ti-steps reveal" aria-label="Quy trình thu cũ">
      ${[['calculator', 'Định giá online', 'Chọn thông số trên web hoặc gửi ảnh, model qua Zalo để nhận giá tham khảo.'],
        ['store', 'Mang máy đến cửa hàng', `Kỹ thuật kiểm tra miễn phí tại ${COMPANY.address}.`],
        ['hand-coins', 'Nhận tiền hoặc lên đời', 'Thanh toán tiền mặt / chuyển khoản, hoặc trừ thẳng vào sản phẩm mới kèm trợ giá.']]
        .map(([ic, t, d], i) => `<div class="ti-step"><span class="ti-step__num">${i + 1}</span>${icon(ic)}<b>${t}</b><p>${d}</p></div>`).join('')}
    </section>

    <section class="section ti-policy" id="chinh-sach" aria-labelledby="ti-policy-title">
      <p class="ti-eyebrow ti-eyebrow--red">Minh Khôi PC thu gì?</p>
      <h2 class="ti-policy__title" id="ti-policy-title">Chính sách thu cũ</h2>
      <p class="ti-policy__desc">Điều kiện tiếp nhận cho 6 nhóm hàng. Mọi trường hợp đều được kỹ thuật kiểm tra trực tiếp trước khi chốt giá.</p>
      ${policyHTML()}
    </section>

    <section class="section ti-cta reveal" aria-label="Liên hệ bán hàng cũ">
      <div>
        <h2>Có đồ cũ muốn bán hôm nay?</h2>
        <p>Gửi ảnh và model qua Zalo để nhận báo giá tham khảo. Giá cuối do kỹ thuật ${COMPANY.name} chốt sau khi kiểm tra thực tế.</p>
      </div>
      <div class="ti-cta__actions">
        <a class="btn ti-btn-white btn--lg" href="${COMPANY.zalo}" target="_blank" rel="noopener">${icon('message-circle')}Chat Zalo</a>
        <a class="btn ti-btn-white btn--lg" href="tel:${COMPANY.phone}">${icon('phone')}Gọi ${COMPANY.phoneDisplay}</a>
      </div>
    </section>`;
  renderCalc();
  initReveal($('#trade-page'));
}

function pickGroup(id, scroll = false) {
  if (!TRADE_IN.groups[id]) return;
  state.group = id;
  state.values = {};
  state.result = null;
  renderCalc();
  if (scroll) $('#dinh-gia').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function submitSend(form) {
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  setFieldError(form.name, name.length >= 2 ? '' : 'Vui lòng nhập họ tên');
  setFieldError(form.phone, isValidPhone(phone) ? '' : 'Số điện thoại không hợp lệ');
  if (name.length < 2 || !isValidPhone(phone)) return;
  const btn = $('button[type="submit"]', form);
  btn.classList.add('is-loading');
  const r = state.result;
  const res = await sendToShop({
    _subject: `Yêu cầu thu cũ ${TRADE_IN.groups[state.group].name} - ${name} - ${formatPrice(r.total)}`,
    'Loại yêu cầu': 'Thu cũ đổi mới',
    'Khách hàng': name,
    'Số điện thoại': phone,
    'Nhóm hàng': TRADE_IN.groups[state.group].name,
    'Thông số': fieldsOf(state.group).map((f) => `${f.label}: ${state.values[f.id]}`).join('\n'),
    'Giá thu tham khảo': formatPrice(r.price),
    'Trợ giá lên đời': r.bonus ? formatPrice(r.bonus) : 'Không',
    'Tổng tham khảo': formatPrice(r.total),
    'Ghi chú': form.note.value.trim() || '(không có)',
  });
  btn.classList.remove('is-loading');
  if (res.ok) {
    form.innerHTML = `<p class="alert alert--success">${icon('circle-check')}<span>Đã gửi! Nhân viên ${COMPANY.name} sẽ gọi lại cho <b>${esc(phone)}</b> trong giờ làm việc.</span></p>`;
    refreshIcons();
  } else {
    showToast(`Chưa gửi được, vui lòng gọi ${COMPANY.phoneDisplay}`, 'error');
  }
}

function initPage() {
  const fromUrl = params.get('nhom');
  if (TRADE_IN.groups[fromUrl]) state.group = fromUrl;
  render();
  const root = $('#trade-page');

  root.addEventListener('change', (e) => {
    const f = e.target.closest('[data-field]');
    if (f) {
      state.values[f.dataset.field] = f.value;
      setFieldError(f, '');
      if (state.result) state.result = null;
      renderSummary();
    }
    if (e.target.matches('[data-upgrade]')) {
      state.upgrade = e.target.checked;
      if (state.result) state.result = calculate();
      renderSummary();
    }
  });

  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-group]');
    if (chip) pickGroup(chip.dataset.group);
    const tile = e.target.closest('[data-pick]');
    if (tile) pickGroup(tile.dataset.pick, true);
    if (e.target.closest('[data-reset]')) pickGroup(state.group);
    if (e.target.closest('[data-calc]')) {
      const r = calculate();
      if (r.error) {
        r.error.forEach((f) => setFieldError($(`#ti-${f.id}`), `Vui lòng chọn ${f.label.toLowerCase()}`));
        $(`#ti-${r.error[0].id}`).focus();
        showToast('Vui lòng chọn đủ thông số', 'error');
        return;
      }
      state.result = r;
      renderSummary();
      if (window.matchMedia('(max-width: 1024px)').matches) $('#ti-summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  root.addEventListener('submit', (e) => {
    if (e.target.id !== 'ti-send') return;
    e.preventDefault();
    submitSend(e.target);
  });
}
