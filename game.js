/**
 * IT SIMULATOR RUSSIA 3D - GAME ENGINE
 * Complete first-person life & career simulator of an IT engineer in Russia
 */

// Global Game State
const Game = {
    state: {
        time: 8 * 60 + 0, // 08:00
        dayIndex: 0,
        days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
        location: 'apartment', // 'apartment' or 'office'
        vitals: {
            energy: 85,
            hunger: 70,
            stress: 20,
            health: 95
        },
        finances: {
            rubles: 48500,
            salary: 0,
            rentPaid: false,
            utilitiesPaid: false
        },
        career: {
            isEmployed: false,
            title: 'Безработный (Поиск на hh.ru)',
            company: 'Самообучение дома',
            experience: 0,
            targetExp: 100,
            reputation: 15,
            completedTasksCount: 0,
            mySkills: ['py', 'sql', 'git'],
            appliedVacancy: null, // null or { id, title, status: 'applied'|'invited' }
            interviewScore: 0,
            interviewCurrentQ: 0
        },
        tasks: [
            {
                id: 'task-0',
                key: 'START-101',
                title: 'Конфигурация сервера в settings.py (🟢 Очень легко)',
                type: 'bug',
                status: 'todo',
                points: 1,
                rewardRub: 6000,
                exp: 30,
                filename: 'settings.py',
                hint: 'Для перехода в продакшен отключите режим отладки (замените DEBUG = True на False) и смените PORT с 80 на 8080.',
                brokenCode: `# START-101: settings.py
# Конфигурация запуска сервиса

APP_NAME = "AuraService"
VERSION = "1.0.4"

# ОШИБКА: Оставлен режим отладки и незащищенный порт 80
DEBUG = True
PORT = 80
HOST = "0.0.0.0"`,
                fixedCode: `# START-101: settings.py
# Конфигурация запуска сервиса

APP_NAME = "AuraService"
VERSION = "1.0.4"

# ИСПРАВЛЕНО: Безопасные настройки для продакшена
DEBUG = False
PORT = 8080
HOST = "0.0.0.0"`,
                testSnippet: `def test_production_settings():
    assert settings.DEBUG is False  # PASS: Отладка отключена
    assert settings.PORT == 8080   # PASS: Порт изменен на 8080`
            },
            {
                id: 'task-1',
                key: 'CALC-102',
                title: 'Расчет скидки по промокоду (🟢 Легко)',
                type: 'bug',
                status: 'todo',
                points: 2,
                rewardRub: 7500,
                exp: 40,
                filename: 'pricing.py',
                hint: 'В функции calculate_final_price скидка прибавляется к цене (price + discount). Замените плюс на минус: price - discount.',
                brokenCode: `# CALC-102: pricing.py

def calculate_final_price(price, discount):
    """Рассчитывает итоговую цену со скидкой"""
    # ОШИБКА: вместо вычитания скидки она прибавляется к сумме чека!
    final_price = price + discount
    return max(0, final_price)`,
                fixedCode: `# CALC-102: pricing.py

def calculate_final_price(price, discount):
    """Рассчитывает итоговую цену со скидкой"""
    # ИСПРАВЛЕНО: скидка корректно вычитается
    final_price = price - discount
    return max(0, final_price)`,
                testSnippet: `def test_pricing_discount():
    assert calculate_final_price(1000, 200) == 800  # PASS: Скидка 200 руб учтена правильно!`
            },
            {
                id: 'task-2',
                key: 'AUTH-103',
                title: 'Валидация длины пароля в auth.py (🟢 Легко)',
                type: 'feat',
                status: 'todo',
                points: 2,
                rewardRub: 8000,
                exp: 45,
                filename: 'auth.py',
                hint: 'Политика безопасности требует пароль длиной от 8 символов. Замените условие len(password) > 3 на len(password) >= 8.',
                brokenCode: `# AUTH-103: auth.py

def validate_user_password(password):
    """Проверяет безопасность пароля пользователя"""
    # ОШИБКА: пропускаются слишком короткие пароли (от 4 символов)
    if len(password) > 3:
        return True
    return False`,
                fixedCode: `# AUTH-103: auth.py

def validate_user_password(password):
    """Проверяет безопасность пароля пользователя"""
    # ИСПРАВЛЕНО: минимальная длина 8 символов
    if len(password) >= 8:
        return True
    return False`,
                testSnippet: `def test_password_policy():
    assert validate_user_password("12345") is False  # PASS: Короткий пароль отклонен
    assert validate_user_password("secure_pass_99") is True  # PASS: Длинный пароль принят`
            },
            {
                id: 'task-3',
                key: 'FIX-104',
                title: 'Утечка соединений к PostgreSQL в пуле (🟡 Средне)',
                type: 'bug',
                status: 'todo',
                points: 3,
                rewardRub: 9500,
                exp: 50,
                filename: 'connection_pool.py',
                hint: 'Замените ручной вызов conn = await self.acquire_connection() на асинхронный контекстный менеджер async with self.pool.acquire() as conn:',
                brokenCode: `# FIX-104: connection_pool.py
import asyncio
import asyncpg

class DatabasePool:
    def __init__(self, dsn):
        self.dsn = dsn
        self.pool = None

    async def acquire_connection(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)
        conn = await self.pool.acquire()
        # ОШИБКА: соединение возвращается напрямую без гарантии освобождения!
        return conn

    async def execute_query(self, query):
        conn = await self.acquire_connection()
        result = await conn.fetch(query)
        return result`,
                fixedCode: `# FIX-104: connection_pool.py (РЕШЕНИЕ)
import asyncio
import asyncpg

class DatabasePool:
    def __init__(self, dsn):
        self.dsn = dsn
        self.pool = None

    async def execute_query(self, query):
        if not self.pool:
            self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)
        # Использование контекстного менеджера гарантирует возврат в пул
        async with self.pool.acquire() as conn:
            result = await conn.fetch(query)
            return result`,
                testSnippet: `def test_connection_leak():
    pool = DatabasePool("test_dsn")
    assert pool.active_connections_count == 0  # PASS: 0 утечек!`
            },
            {
                id: 'task-4',
                key: 'FEAT-202',
                title: 'Идемпотентность списаний СБП через Redis (🟡 Средне)',
                type: 'feat',
                status: 'todo',
                points: 5,
                rewardRub: 15000,
                exp: 70,
                filename: 'payment_service.py',
                hint: 'Добавьте атомарную проверку ключа через r.set(f"idemp:{idempotency_key}", "processing", nx=True, ex=300). Если ключ уже есть — верните DUPLICATE_IGNORED.',
                brokenCode: `# FEAT-202: payment_service.py
import redis

def process_sbp_payment(account_id, amount, idempotency_key):
    # ОШИБКА: нет проверки ключа идемпотентности в Redis!
    balance = get_balance(account_id)
    if balance >= amount:
        deduct_money(account_id, amount)
        return {"status": "SUCCESS", "tx_id": "tx_9921"}
    return {"status": "INSUFFICIENT_FUNDS"}`,
                fixedCode: `# FEAT-202: payment_service.py (РЕШЕНИЕ)
import redis

def process_sbp_payment(account_id, amount, idempotency_key):
    r = redis.Redis()
    # Атомарная проверка ключа через SET NX EX
    if not r.set(f"idemp:{idempotency_key}", "processing", nx=True, ex=300):
        return {"status": "DUPLICATE_IGNORED", "message": "Повторный запрос отфильтрован"}

    balance = get_balance(account_id)
    if balance >= amount:
        deduct_money(account_id, amount)
        r.set(f"idemp:{idempotency_key}", "completed", ex=86400)
        return {"status": "SUCCESS", "tx_id": "tx_9921"}
    return {"status": "INSUFFICIENT_FUNDS"}`,
                testSnippet: `def test_idempotency_double_request():
    assert res2["status"] == "DUPLICATE_IGNORED"  # PASS: Задвоение предотвращено!`
            },
            {
                id: 'task-5',
                key: 'PERF-88',
                title: 'Устранение N+1 запросов в выгрузке отчетов (🔴 Сложно)',
                type: 'refactor',
                status: 'todo',
                points: 5,
                rewardRub: 14000,
                exp: 65,
                filename: 'transaction_report.py',
                hint: 'Соберите user_ids в список и сделайте единый SQL-запрос WHERE user_id IN (...) вместо цикла.',
                brokenCode: `# PERF-88: transaction_report.py
def generate_daily_report(users):
    report = []
    for user in users:
        # АНТИПАТТЕРН N+1: SQL-запрос в цикле для каждого пользователя
        orders = db.query(f"SELECT * FROM orders WHERE user_id = {user.id}")
        report.append({"user": user.name, "orders": orders})
    return report`,
                fixedCode: `# PERF-88: transaction_report.py (РЕШЕНИЕ)
import collections

def generate_daily_report(users):
    user_ids = [u.id for u in users]
    all_orders = db.query(f"SELECT * FROM orders WHERE user_id IN ({','.join(map(str, user_ids))})")
    orders_by_user = collections.defaultdict(list)
    for o in all_orders:
        orders_by_user[o.user_id].append(o)
    return [{"user": u.name, "orders": orders_by_user[u.id]} for u in users]`,
                testSnippet: `def test_perf_queries_count():
    assert qc.count <= 2  # PASS: 2 запроса вместо 1001!`
            }
        ],
        chatMessages: {
            backend: [
                { sender: 'Артем Савельев', role: 'Team Lead', time: '09:15', text: 'Всем привет! Напоминаю, в 11:00 дейли в переговорке "Байкал". Денис заканчивает автотесты, посмотрите алерты в #alerts-prod.' },
                { sender: 'Иван Кузнецов', role: 'Senior Dev', time: '09:20', text: 'В пуле коннектов PostgreSQL утечка при нагрузке 500+ rps. Завел FIX-104 в джире, нужно срочно закрыть до релиза.' }
            ],
            general: [
                { sender: 'HR Мария', role: 'People Partner', time: '08:45', text: 'Коллеги, на кухне свежие круассаны и фрукты! Не забывайте отмечать дейли-чекины в корпоративном боте.' }
            ],
            alerts: [
                { sender: 'Grafana Alertmanager', role: 'Bot', time: '09:02', text: '⚠️ [FIRING] HighConnectionCount: Database connection pool utilization > 92% on prod-pg-01.' }
            ],
            lead: [
                { sender: 'Артем Савельев', role: 'Team Lead', time: '09:30', text: 'Привет! Как адаптация? Возьми FIX-104 или FEAT-202 на выбор. Если будут вопросы по архитектуре — смело пиши.' }
            ],
            pm: [
                { sender: 'Ольга Корнеева', role: 'Product Manager', time: '09:40', text: 'Привет! Бизнес очень ждет фичу СБП с идемпотентностью. Клиенты жалуются на задвоение списаний при лагах сети. Успеем сегодня?' }
            ]
        },
        currentActiveTaskId: 'task-0',
        currentChatChannel: 'backend'
    }
};

/**
 * PROCEDURAL AUDIO ENGINE (Web Audio API)
 * All audio generated procedurally with zero external asset dependencies
 */
const AudioEngine = {
    ctx: null,
    init() {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch(e) {
            console.warn('AudioContext not supported or blocked:', e);
        }
    },
    playStep() {
        try {
            if (!this.ctx || typeof this.ctx.createOscillator !== 'function') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(80 + Math.random() * 20, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        } catch(e) {}
    },
    playClick() {
        try {
            if (!this.ctx || typeof this.ctx.createOscillator !== 'function') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.03);
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.03);
        } catch(e) {}
    },
    playSuccess() {
        try {
            if (!this.ctx || typeof this.ctx.createOscillator !== 'function') return;
            const t = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + i * 0.08);
                gain.gain.setValueAtTime(0.05, t + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.2);
            });
        } catch(e) {}
    },
    playNotification() {
        try {
            if (!this.ctx || typeof this.ctx.createOscillator !== 'function') return;
            const t = this.ctx.currentTime;
            [880, 1174.66].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + i * 0.09);
                gain.gain.setValueAtTime(0.06, t + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.18);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.09);
                osc.stop(t + i * 0.09 + 0.18);
            });
        } catch(e) {}
    },
    playKettle() {
        try {
            if (!this.ctx || typeof this.ctx.createBufferSource !== 'function') return;
            const bufferSize = this.ctx.sampleRate * 1.5;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);
            filter.Q.setValueAtTime(4, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch(e) {}
    }
};

const TextureGen = {
    createParquet() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(0, 0, 512, 512);

        const plankH = 32;
        for (let y = 0; y < 512; y += plankH) {
            const shift = (y / plankH) % 2 === 0 ? 0 : 64;
            for (let x = -64; x < 512; x += 128) {
                const shade = (Math.random() - 0.5) * 20;
                ctx.fillStyle = `rgb(${107 + shade}, ${68 + shade * 0.8}, ${35 + shade * 0.5})`;
                ctx.fillRect(x + shift, y, 126, plankH - 2);

                ctx.strokeStyle = '#3d2512';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + shift, y, 126, plankH - 2);
            }
        }
        return new THREE.CanvasTexture(canvas);
    },
    createOfficeCarpet() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#222933';
        ctx.fillRect(0, 0, 256, 256);

        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const c = Math.random() > 0.5 ? '#2d3748' : '#1a202c';
            ctx.fillStyle = c;
            ctx.fillRect(x, y, 2, 2);
        }
        const t = new THREE.CanvasTexture(canvas);
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(8, 8);
        return t;
    },
    createWallpaper() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e2ded5';
        ctx.fillRect(0, 0, 256, 256);

        ctx.strokeStyle = 'rgba(180, 175, 165, 0.4)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 256; x += 4) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 256);
            ctx.stroke();
        }
        const t = new THREE.CanvasTexture(canvas);
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(4, 4);
        return t;
    },
    createCityView() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dusk / Twilight Russian City Sky
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#111827');
        grad.addColorStop(0.6, '#312e81');
        grad.addColorStop(0.85, '#7c2d12');
        grad.addColorStop(1, '#9a3412');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        // Typical panel buildings (П-44Т)
        for (let b = 0; b < 24; b++) {
            const bw = 50 + Math.random() * 40;
            const bh = 180 + Math.random() * 180;
            const bx = b * 44;
            const by = 512 - bh;

            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(bx, by, bw, bh);

            // Lit windows
            for (let wy = by + 10; wy < 500; wy += 12) {
                for (let wx = bx + 6; wx < bx + bw - 6; wx += 10) {
                    if (Math.random() > 0.45) {
                        ctx.fillStyle = Math.random() > 0.3 ? '#fef08a' : '#fed7aa';
                        ctx.fillRect(wx, wy, 5, 6);
                    }
                }
            }
        }
        return new THREE.CanvasTexture(canvas);
    },
    createServerRack() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark matte rack frame
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 512, 1024);

        // Rack rails and 42U units
        const uHeight = 24;
        for (let y = 10; y < 1010; y += uHeight) {
            // Server unit chassis
            ctx.fillStyle = (Math.floor(y / uHeight) % 2 === 0) ? '#111827' : '#1e293b';
            ctx.fillRect(16, y, 480, uHeight - 2);

            // Ventilation grilles (perforated dots)
            ctx.fillStyle = '#030712';
            for (let gx = 30; gx < 320; gx += 8) {
                ctx.fillRect(gx, y + 4, 3, uHeight - 10);
            }

            // Blinking Activity LEDs (Neon Blue, Cyan, Emerald Green)
            for (let ledX = 350; ledX < 470; ledX += 14) {
                const rand = Math.random();
                let ledColor = '#0284c7';
                if (rand > 0.6) ledColor = '#38bdf8';
                else if (rand > 0.3) ledColor = '#10b981';
                else if (rand > 0.95) ledColor = '#ef4444';

                ctx.fillStyle = ledColor;
                ctx.beginPath();
                ctx.arc(ledX, y + uHeight / 2 - 1, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Side cable management ducts
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, 16, 1024);
        ctx.fillRect(496, 0, 16, 1024);

        return new THREE.CanvasTexture(canvas);
    },

    createMonitorScreen(text, bgColor = '#0f172a') {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 288;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 512, 288);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 512, 26);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('VS Code - ' + text, 12, 18);

        ctx.font = '11px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('import asyncio, asyncpg', 16, 52);
        ctx.fillText('async def handle_request(ctx):', 16, 74);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('    conn = await pool.acquire()', 16, 96);
        ctx.fillStyle = '#4ade80';
        ctx.fillText('    # TODO: Refactor connection leak', 16, 118);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('    return {"status": "ok"}', 16, 140);

        return new THREE.CanvasTexture(canvas);
    }
};

/**
 * 3D SCENE & ENGINE
 */
const Engine3D = {
    renderer: null,
    scene: null,
    camera: null,
    interactiveObjects: [],
    currentLocation: 'apartment',
    lights: {},

    startGame() {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        PlayerController.isStarted = true;
        try {
            AudioEngine.init();
        } catch(e) {}
        try {
            const canvas = document.getElementById('game-canvas');
            canvas.requestPointerLock();
        } catch(e) {}
        this.showToast('Симуляция запущена', 'Вы в игре! Используйте WASD для ходьбы и [E] для взаимодействия.');
    },

    init() {
        const canvas = document.getElementById('game-canvas');
        if (typeof THREE === 'undefined') {
            console.warn('Three.js CDN not loaded. Running fallback visualizer.');
            this.initFallback2D(canvas);
            return;
        }
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0a0d14');

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 1.7, 0);

        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.lights.ambient);

        this.lights.sun = new THREE.DirectionalLight(0xfffaed, 0.7);
        this.lights.sun.position.set(10, 15, 10);
        this.lights.sun.castShadow = true;
        this.scene.add(this.lights.sun);

        this.buildLocation('apartment');

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    },

    clearScene() {
        this.interactiveObjects = [];
        while (this.scene.children.length > 0) {
            const obj = this.scene.children[0];
            this.scene.remove(obj);
        }
        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.sun);
    },

    buildLocation(type) {
        this.currentLocation = type;
        if (this.isFallback2D) {
            this.buildFallbackLocation(type);
            return;
        }
        this.clearScene();
        if (type === 'apartment') {
            this.buildApartment();
        } else if (type === 'office') {
            this.buildOffice();
        } else if (type === 'server_room') {
            this.buildServerRoom();
        }
    },


    isFallback2D: false,
    fallbackPlayer: { x: 400, y: 300 },
    fallbackInteractables: [],

    initFallback2D(canvas) {
        this.isFallback2D = true;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        this.buildFallbackLocation('apartment');
    },

    buildFallbackLocation(type) {
        this.currentLocation = type;
        this.fallbackInteractables = [];
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const cx = cw / 2;
        const cy = ch / 2;
        this.fallbackPlayer.x = cx;
        this.fallbackPlayer.y = cy;

        if (type === 'apartment') {
            this.fallbackInteractables.push({
                x: cx - 240, y: cy - 140, w: 120, h: 80,
                color: '#2563eb', label: 'Рабочий стол (DevOS)',
                prompt: 'Компьютер: сесть за рабочую станцию (DevOS)',
                action: () => GameApp.openWorkstation()
            });
            this.fallbackInteractables.push({
                x: cx + 180, y: cy - 140, w: 100, h: 140,
                color: '#6366f1', label: 'Кровать',
                prompt: 'Кровать: лечь спать / отдохнуть',
                action: () => GameApp.openBedDialog()
            });
            this.fallbackInteractables.push({
                x: cx + 180, y: cy + 100, w: 90, h: 90,
                color: '#ef4444', label: 'Холодильник / Кухня',
                prompt: 'Холодильник и кухня: перекусить / заварить чай',
                action: () => GameApp.openKitchenDialog()
            });
            this.fallbackInteractables.push({
                x: cx - 180, y: cy + 180, w: 80, h: 50,
                color: '#10b981', label: 'Выход / Метро',
                prompt: 'Входная дверь: поехать в офис / выйти на улицу',
                action: () => GameApp.openCommuteDialog()
            });
        } else if (type === 'office') {
            this.fallbackInteractables.push({
                x: cx, y: cy - 60, w: 160, h: 80,
                color: '#2563eb', label: 'Мое рабочее место (DevOS)',
                prompt: 'Моё рабочее место: открыть DevOS (IDE, Jira, Matterchat)',
                action: () => GameApp.openWorkstation()
            });
            this.fallbackInteractables.push({
                x: cx - 280, y: cy - 160, w: 180, h: 120,
                color: '#0284c7', label: 'Переговорная "Байкал"',
                prompt: 'Переговорная "Байкал": участвовать в Daily Standup',
                action: () => GameApp.openMeetingDialog()
            });
            this.fallbackInteractables.push({
                x: cx + 220, y: cy - 160, w: 140, h: 90,
                color: '#f59e0b', label: 'Кофе-поинт',
                prompt: 'Кофе-поинт: выпить эспрессо / поболтать у кулера',
                action: () => GameApp.openCoffeeDialog()
            });
            this.fallbackInteractables.push({
                x: cx, y: cy + 220, w: 100, h: 50,
                color: '#ef4444', label: 'Турникет / Домой',
                prompt: 'Турникет БЦ: завершить рабочий день и поехать домой',
                action: () => GameApp.openLeaveOfficeDialog()
            });
            this.fallbackInteractables.push({
                x: cx - 280, y: cy + 160, w: 140, h: 60,
                color: '#0284c7', label: '🚪 Серверная',
                prompt: '🚪 Серверная: войти в серверную комнату',
                action: () => GameApp.travelTo('server_room', 'walk', 0, 1)
            });
        } else if (type === 'server_room') {
            this.fallbackInteractables.push({
                x: cx, y: cy - 140, w: 200, h: 90,
                color: '#38bdf8', label: 'Консоль KVM (Linux Terminal)',
                prompt: 'Серверная консоль KVM: открыть Linux Terminal (srv-core-01)',
                action: () => ServerTerminal.open()
            });
            this.fallbackInteractables.push({
                x: cx, y: cy + 180, w: 140, h: 60,
                color: '#ef4444', label: 'Выход в офис',
                prompt: 'Дверь: вернуться в open-space офис',
                action: () => GameApp.travelTo('office', 'walk', 0, 1)
            });
        }
    },

    renderFallback2D() {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, cw, ch);

        const cx = cw / 2;
        const cy = ch / 2;

        ctx.fillStyle = this.currentLocation === 'apartment' ? '#3d2512' : (this.currentLocation === 'server_room' ? '#090d16' : '#1e293b');
        const rw = 700;
        const rh = 500;
        ctx.fillRect(cx - rw / 2, cy - rh / 2, rw, rh);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.strokeRect(cx - rw / 2, cy - rh / 2, rw, rh);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        let roomName = 'КВАРТИРА В СПАЛЬНОМ РАЙОНЕ (ДЕВЯТКИНО / МУРИНО)';
        if (this.currentLocation === 'office') roomName = 'ОФИС IT-КОМПАНИИ "AURA CLOUD" (OPEN SPACE)';
        else if (this.currentLocation === 'server_room') roomName = 'СЕРВЕРНАЯ СТОЙКА #4 (DATA CENTER)';
        ctx.fillText(roomName, cx, cy - rh / 2 + 30);

        let nearest = null;
        let minDist = 90;

        this.fallbackInteractables.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillRect(item.x, item.y, item.w, item.h);
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x, item.y, item.w, item.h);

            ctx.fillStyle = '#ffffff';
            ctx.font = '12px sans-serif';
            ctx.fillText(item.label, item.x + item.w / 2, item.y + item.h / 2 + 4);

            const dist = Math.hypot(
                this.fallbackPlayer.x - (item.x + item.w / 2),
                this.fallbackPlayer.y - (item.y + item.h / 2)
            );
            if (dist < minDist) {
                nearest = item;
                minDist = dist;
            }
        });

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(this.fallbackPlayer.x, this.fallbackPlayer.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('ВЫ', this.fallbackPlayer.x, this.fallbackPlayer.y + 4);

        const promptEl = document.getElementById('interaction-prompt');
        const promptText = document.getElementById('prompt-text');
        const reticle = document.getElementById('reticle');

        if (nearest) {
            PlayerController.currentInteractable = nearest;
            promptEl.style.display = 'block';
            promptText.innerText = nearest.prompt;
            reticle.classList.add('active');
        } else {
            PlayerController.currentInteractable = null;
            promptEl.style.display = 'none';
            reticle.classList.remove('active');
        }
    },


    buildServerRoom() {
        this.scene.fog = new THREE.FogExp2('#030712', 0.025);

        // Data Center Raised Floor (Фальшпол)
        const floorGeo = new THREE.PlaneGeometry(10, 20);
        const floorMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.5 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Ceiling with suspended cable trays
        const ceilMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.9 });
        const ceiling = new THREE.Mesh(floorGeo, ceilMat);
        ceiling.position.y = 3.6;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Cable Tray Mesh under ceiling
        const trayGeo = new THREE.BoxGeometry(1.6, 0.1, 18);
        const trayMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8 });
        const tray = new THREE.Mesh(trayGeo, trayMat);
        tray.position.set(0, 3.2, 0);
        this.scene.add(tray);

        // Perimeter Walls
        const wallMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.7 });
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3.6, 0.2), wallMat);
        backWall.position.set(0, 1.8, -10);
        const frontWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3.6, 0.2), wallMat);
        frontWall.position.set(0, 1.8, 10);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 20), wallMat);
        leftWall.position.set(-5, 1.8, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 20), wallMat);
        rightWall.position.set(5, 1.8, 0);
        this.scene.add(backWall, frontWall, leftWall, rightWall);

        // Towering Server Racks (Left & Right Corridor)
        const rackTex = TextureGen.createServerRack();
        const rackMat = new THREE.MeshStandardMaterial({ map: rackTex, roughness: 0.5, metalness: 0.6 });

        [-3.2, 3.2].forEach(x => {
            for (let z = -7; z <= 7; z += 2.4) {
                const rackGeo = new THREE.BoxGeometry(1.4, 3.0, 2.0);
                const rack = new THREE.Mesh(rackGeo, rackMat);
                rack.position.set(x, 1.5, z);
                this.scene.add(rack);

                // Blue LED glow from each rack bay
                const ledLight = new THREE.PointLight(0x0284c7, 0.8, 4);
                ledLight.position.set(x > 0 ? x - 0.9 : x + 0.9, 1.6, z);
                this.scene.add(ledLight);
            }
        });

        // Overhead Cool Blue Corridor Lights
        [-4, 0, 4].forEach(z => {
            const blueLight = new THREE.PointLight(0x38bdf8, 1.0, 10);
            blueLight.position.set(0, 3.3, z);
            this.scene.add(blueLight);
        });

        // Sysadmin Console Table (KVM Crash Cart) at far end (z = -8)
        const consoleGroup = new THREE.Group();
        consoleGroup.position.set(0, 0, -8);

        const table = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.0), new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4 }));
        table.position.y = 0.85;

        // Diagnostic Monitor with green terminal text
        const monScreen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.03), new THREE.MeshBasicMaterial({ color: '#030712' }));
        monScreen.position.set(0, 1.25, 0);

        // Rack Status Beacon (Green / Red Rotating Beacon)
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18), new THREE.MeshBasicMaterial({ color: '#38bdf8' }));
        beacon.position.set(0.7, 1.0, 0);

        consoleGroup.add(table, monScreen, beacon);
        this.scene.add(consoleGroup);

        this.registerInteractive(
            consoleGroup,
            'Серверная консоль KVM: открыть Linux Terminal (srv-core-01)',
            () => ServerTerminal.open()
        );

        // Exit Door back to Office (z = 9.8)
        const exitDoorGroup = new THREE.Group();
        exitDoorGroup.position.set(0, 0, 9.8);
        const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), new THREE.MeshStandardMaterial({ color: '#0284c7', metalness: 0.7 }));
        doorMesh.position.y = 1.2;
        exitDoorGroup.add(doorMesh);
        this.scene.add(exitDoorGroup);

        this.registerInteractive(
            exitDoorGroup,
            'Дверь: вернуться в open-space офис',
            () => GameApp.travelTo('office', 'walk', 0, 1)
        );

        this.camera.position.set(0, 1.7, 6);
        this.camera.rotation.set(0, 0, 0);
    },

    buildApartment() {
        this.scene.fog = new THREE.FogExp2('#111827', 0.02);

        const parquetTex = TextureGen.createParquet();
        parquetTex.wrapS = THREE.RepeatWrapping;
        parquetTex.wrapT = THREE.RepeatWrapping;
        parquetTex.repeat.set(4, 5);

        const wallTex = TextureGen.createWallpaper();

        // Floor
        const floorGeo = new THREE.PlaneGeometry(10, 12);
        const floorMat = new THREE.MeshStandardMaterial({ map: parquetTex, roughness: 0.6, metalness: 0.1 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.9 });
        const ceiling = new THREE.Mesh(floorGeo, ceilMat);
        ceiling.position.y = 3.0;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Walls
        const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85 });
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.2), wallMat);
        backWall.position.set(0, 1.5, -6);
        const frontWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 0.2), wallMat);
        frontWall.position.set(0, 1.5, 6);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 12), wallMat);
        leftWall.position.set(-5, 1.5, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 12), wallMat);
        rightWall.position.set(5, 1.5, 0);
        this.scene.add(backWall, frontWall, leftWall, rightWall);

        // Window View of Russian panel buildings
        const winMat = new THREE.MeshBasicMaterial({ map: TextureGen.createCityView() });
        const windowView = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.1), winMat);
        windowView.position.set(0, 1.6, -5.85);
        this.scene.add(windowView);

        // Window sill & Cast iron radiator
        const sill = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: '#ffffff' }));
        sill.position.set(0, 0.6, -5.7);
        const radiator = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.15), new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.5 }));
        radiator.position.set(0, 0.3, -5.7);
        this.scene.add(sill, radiator);

        // 1. Desk & PC Setup
        const deskGroup = new THREE.Group();
        deskGroup.position.set(-3.2, 0, -4.5);

        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.9), new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3 }));
        tableTop.position.y = 0.75;
        deskGroup.add(tableTop);

        const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.75);
        const legMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8 });
        [-0.8, 0.8].forEach(x => {
            [-0.35, 0.35].forEach(z => {
                const leg = new THREE.Mesh(legGeo, legMat);
                leg.position.set(x, 0.375, z);
                deskGroup.add(leg);
            });
        });

        // Dual Monitors
        const monGeo = new THREE.BoxGeometry(0.7, 0.42, 0.03);
        const screenMat = new THREE.MeshBasicMaterial({ map: TextureGen.createMonitorScreen('Home Dev Station') });
        const mon1 = new THREE.Mesh(monGeo, screenMat);
        mon1.position.set(-0.25, 1.05, 0);
        mon1.rotation.y = 0.15;
        const mon2 = new THREE.Mesh(monGeo, screenMat);
        mon2.position.set(0.42, 1.05, 0.02);
        mon2.rotation.y = -0.2;
        deskGroup.add(mon1, mon2);

        // Chair
        const chairMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.7 });
        const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.1), chairMat);
        chairBack.position.set(0, 0.9, 0.75);
        const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), chairMat);
        chairSeat.position.set(0, 0.45, 0.55);
        deskGroup.add(chairBack, chairSeat);

        this.scene.add(deskGroup);
        this.registerInteractive(deskGroup, 'Рабочий стол: войти в DevOS (IDE, Jira, Matterchat)', () => GameApp.openWorkstation());

        // 2. Bed (Sleep)
        const bedGroup = new THREE.Group();
        bedGroup.position.set(3.2, 0, -3.8);
        const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.6), new THREE.MeshStandardMaterial({ color: '#334155' }));
        bedBase.position.y = 0.2;
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 1.4), new THREE.MeshStandardMaterial({ color: '#cbd5e1' }));
        mattress.position.y = 0.45;
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.7), new THREE.MeshStandardMaterial({ color: '#f8fafc' }));
        pillow.position.set(-0.7, 0.6, 0);
        bedGroup.add(bedBase, mattress, pillow);
        this.scene.add(bedGroup);
        this.registerInteractive(bedGroup, 'Кровать: лечь спать / отдохнуть', () => GameApp.openBedDialog());

        // 3. Kitchen & Fridge
        const kitchenGroup = new THREE.Group();
        kitchenGroup.position.set(3.5, 0, 3.5);
        const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.8, 0.85), new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.3 }));
        fridge.position.set(0, 0.9, 0);
        const counter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 0.85), new THREE.MeshStandardMaterial({ color: '#475569' }));
        counter.position.set(-1.25, 0.425, 0);
        const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.22, 16), new THREE.MeshStandardMaterial({ color: '#dc2626', metalness: 0.8 }));
        kettle.position.set(-1.25, 0.95, 0);
        kitchenGroup.add(fridge, counter, kettle);
        this.scene.add(kitchenGroup);
        this.registerInteractive(kitchenGroup, 'Кухня и холодильник: перекусить / заварить чай', () => GameApp.openKitchenDialog());

        // 4. Door to Street / Commute
        const doorGroup = new THREE.Group();
        doorGroup.position.set(-1.5, 0, 5.9);
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: '#1e293b' }));
        doorFrame.position.y = 1.1;
        doorGroup.add(doorFrame);
        this.scene.add(doorGroup);
        this.registerInteractive(doorGroup, 'Входная дверь: поехать в офис / выйти на улицу', () => GameApp.openCommuteDialog());

        // Light
        const roomLight = new THREE.PointLight(0xffeedd, 0.85, 14);
        roomLight.position.set(0, 2.6, 0);
        this.scene.add(roomLight);

        this.camera.position.set(0, 1.7, 1);
        this.camera.rotation.set(0, 0, 0);
    },

    buildOffice() {
        this.scene.fog = new THREE.FogExp2('#1e293b', 0.015);

        const carpetTex = TextureGen.createOfficeCarpet();

        // Floor
        const floorGeo = new THREE.PlaneGeometry(28, 28);
        const floorMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.8 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // High Tech Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.9 });
        const ceiling = new THREE.Mesh(floorGeo, ceilMat);
        ceiling.position.y = 3.6;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Walls
        const wallMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.5 });
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 3.6, 0.2), wallMat);
        backWall.position.set(0, 1.8, -14);
        const frontWall = new THREE.Mesh(new THREE.BoxGeometry(28, 3.6, 0.2), wallMat);
        frontWall.position.set(0, 1.8, 14);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 28), wallMat);
        leftWall.position.set(-14, 1.8, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 28), wallMat);
        rightWall.position.set(14, 1.8, 0);
        this.scene.add(backWall, frontWall, leftWall, rightWall);

        // Office Lighting Panels
        for (let x = -8; x <= 8; x += 8) {
            for (let z = -8; z <= 8; z += 8) {
                const light = new THREE.PointLight(0xf0f9ff, 0.75, 14);
                light.position.set(x, 3.3, z);
                this.scene.add(light);

                const panel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 1.0), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
                panel.position.set(x, 3.55, z);
                this.scene.add(panel);
            }
        }

        // Desks
        this.scene.add(this.createOfficeDeskCluster(0, 0, true));
        this.scene.add(this.createOfficeDeskCluster(-7, 0, false));
        this.scene.add(this.createOfficeDeskCluster(7, 0, false));
        this.scene.add(this.createOfficeDeskCluster(0, -6, false));

        // Glass Meeting Room "Байкал" (Standup)
        const meetingGroup = new THREE.Group();
        meetingGroup.position.set(-8, 0, -9);

        const glassMat = new THREE.MeshPhysicalMaterial({
            color: '#38bdf8',
            transparent: true,
            opacity: 0.25,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 0.1
        });
        const mWall1 = new THREE.Mesh(new THREE.BoxGeometry(6, 3.6, 0.1), glassMat);
        mWall1.position.set(0, 1.8, 3);
        const mWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.6, 6), glassMat);
        mWall2.position.set(3, 1.8, 0);

        const confTable = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.08, 1.8), new THREE.MeshStandardMaterial({ color: '#0f172a' }));
        confTable.position.set(0, 0.75, 0);

        const screen = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 0.05), new THREE.MeshBasicMaterial({ color: '#0284c7' }));
        screen.position.set(0, 2.0, -2.9);

        meetingGroup.add(mWall1, mWall2, confTable, screen);
        this.scene.add(meetingGroup);
        this.registerInteractive(meetingGroup, 'Переговорная "Байкал": участвовать в Daily Standup', () => GameApp.openMeetingDialog());

        // Coffee-Point
        const coffeeGroup = new THREE.Group();
        coffeeGroup.position.set(9, 0, -9);
        const barCounter = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.9, 1.2), new THREE.MeshStandardMaterial({ color: '#334155' }));
        barCounter.position.set(0, 0.45, 0);
        const coffeeMachine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: '#dc2626', metalness: 0.8 }));
        coffeeMachine.position.set(-0.8, 1.15, 0);
        const coolerBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), new THREE.MeshStandardMaterial({ color: '#f8fafc' }));
        coolerBase.position.set(1.2, 0.45, 0);
        coffeeGroup.add(barCounter, coffeeMachine, coolerBase);
        this.scene.add(coffeeGroup);
        this.registerInteractive(coffeeGroup, 'Кофе-поинт: выпить эспрессо / поболтать у кулера', () => GameApp.openCoffeeDialog());

        // Office Exit
        const exitGroup = new THREE.Group();
        exitGroup.position.set(0, 0, 13);
        const turnstile = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 0.4), new THREE.MeshStandardMaterial({ color: '#0284c7', metalness: 0.7 }));
        turnstile.position.y = 0.5;
        exitGroup.add(turnstile);
        this.scene.add(exitGroup);
        this.registerInteractive(exitGroup, 'Турникет БЦ: завершить рабочий день и поехать домой', () => GameApp.openLeaveOfficeDialog());

        // Heavy Security Door to Server Room (x = -13.8, z = 4)
        const serverDoorGroup = new THREE.Group();
        serverDoorGroup.position.set(-13.8, 0, 4);
        const sDoor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 1.6), new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.8 }));
        sDoor.position.y = 1.2;
        const keyPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.15), new THREE.MeshBasicMaterial({ color: '#38bdf8' }));
        keyPad.position.set(0.12, 1.2, 0.5);
        serverDoorGroup.add(sDoor, keyPad);
        this.scene.add(serverDoorGroup);

        this.registerInteractive(
            serverDoorGroup,
            '🚪 Серверная (Server Room): войти в комнату серверов',
            () => GameApp.travelTo('server_room', 'walk', 0, 1)
        );

        this.camera.position.set(0, 1.7, 2.5);
        this.camera.rotation.set(0, 0, 0);
    },

    createOfficeDeskCluster(cx, cz, isPlayerCluster) {
        const cluster = new THREE.Group();
        cluster.position.set(cx, 0, cz);

        const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.2 }));
        table.position.y = 0.75;
        cluster.add(table);

        const screenMat = new THREE.MeshBasicMaterial({ map: TextureGen.createMonitorScreen(isPlayerCluster ? 'Work PC' : 'Dev Server') });
        const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.03), screenMat);
        mon1.position.set(-0.35, 1.05, 0);
        const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.03), screenMat);
        mon2.position.set(0.35, 1.05, 0);
        cluster.add(mon1, mon2);

        if (isPlayerCluster) {
            this.registerInteractive(cluster, 'Моё рабочее место: открыть DevOS (IDE, Jira, Matterchat)', () => GameApp.openWorkstation());
        }

        return cluster;
    },

    registerInteractive(meshGroup, promptText, actionCallback) {
        meshGroup.traverse(child => {
            if (child.isMesh) {
                child.userData = {
                    isInteractive: true,
                    prompt: promptText,
                    action: actionCallback,
                    rootGroup: meshGroup
                };
                this.interactiveObjects.push(child);
            }
        });
    }
};

/**
 * PLAYER CONTROLLER & INPUT
 */
const PlayerController = {
    isLocked: false,
    isStarted: false,
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false,
    velocity: null,
    direction: null,
    euler: null,
    currentInteractable: null,
    headBobTimer: 0,

    startGame() {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        PlayerController.isStarted = true;
        try {
            AudioEngine.init();
        } catch(e) {}
        try {
            const canvas = document.getElementById('game-canvas');
            canvas.requestPointerLock();
        } catch(e) {}
        this.showToast('Симуляция запущена', 'Вы в игре! Используйте WASD для ходьбы и [E] для взаимодействия.');
    },

    init() {
        const canvas = document.getElementById('game-canvas');
        const startBtn = document.getElementById('start-game-btn');
        const overlay = document.getElementById('start-overlay');

        if (typeof THREE !== 'undefined') {
            this.velocity = new THREE.Vector3();
            this.direction = new THREE.Vector3();
            this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        } else {
            this.velocity = { x: 0, y: 0, z: 0 };
            this.direction = { x: 0, y: 0, z: 0 };
            this.euler = { x: 0, y: 0, z: 0, setFromQuaternion: () => {} };
        }

        // Direct, bulletproof start button handler
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
                AudioEngine.init();
            } catch(err) {
                console.warn('Audio init error:', err);
            }
            this.isStarted = true;
            overlay.style.display = 'none';
            try {
                canvas.requestPointerLock();
            } catch(err) {
                console.warn('PointerLock request error:', err);
            }
        });

        canvas.addEventListener('click', () => {
            if (this.isStarted && document.getElementById('interactive-overlay').style.display === 'none') {
                try {
                    canvas.requestPointerLock();
                } catch(err) {}
            }
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === canvas) {
                this.isLocked = true;
                overlay.style.display = 'none';
            } else {
                this.isLocked = false;
                // Never re-lock the screen with start-overlay once started
            }
        });

        let isMouseDown = false;
        let lastX = 0, lastY = 0;

        document.addEventListener('mousedown', (e) => {
            if (e.target === canvas) {
                isMouseDown = true;
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isStarted) return;
            let movementX = e.movementX || 0;
            let movementY = e.movementY || 0;

            if (!this.isLocked) {
                if (isMouseDown) {
                    movementX = e.clientX - lastX;
                    movementY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                } else {
                    return;
                }
            }

            if (typeof THREE !== 'undefined' && Engine3D.camera && this.euler) {
                this.euler.setFromQuaternion(Engine3D.camera.quaternion);
                this.euler.y -= movementX * 0.0022;
                this.euler.x -= movementY * 0.0022;
                this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
                Engine3D.camera.quaternion.setFromEuler(this.euler);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.isLocked && document.getElementById('interactive-overlay').style.display !== 'none') {
                if (e.code === 'Escape') GameApp.closeModal();
                return;
            }

            switch (e.code) {
                case 'KeyW': this.moveForward = true; break;
                case 'KeyA': this.moveLeft = true; break;
                case 'KeyS': this.moveBackward = true; break;
                case 'KeyD': this.moveRight = true; break;
                case 'Space':
                    if (this.canJump) {
                        this.velocity.y += 4.5;
                        this.canJump = false;
                    }
                    break;
                case 'KeyE':
                    if (this.currentInteractable && this.isLocked) {
                        AudioEngine.playClick();
                        document.exitPointerLock();
                        this.currentInteractable.action();
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = false; break;
                case 'KeyA': this.moveLeft = false; break;
                case 'KeyS': this.moveBackward = false; break;
                case 'KeyD': this.moveRight = false; break;
            }
        });
    },

    update(delta) {
        if (!this.isStarted) return;

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= 9.8 * 1.5 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (Engine3D.isFallback2D) {
            const pSpeed = 260 * delta;
            if (this.moveForward) Engine3D.fallbackPlayer.y -= pSpeed;
            if (this.moveBackward) Engine3D.fallbackPlayer.y += pSpeed;
            if (this.moveLeft) Engine3D.fallbackPlayer.x -= pSpeed;
            if (this.moveRight) Engine3D.fallbackPlayer.x += pSpeed;
            return;
        }
        const speed = 3.8;
        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * speed * 8.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * speed * 8.0 * delta;

        Engine3D.camera.translateX(-this.velocity.x * delta);
        Engine3D.camera.translateZ(this.velocity.z * delta);
        Engine3D.camera.position.y += this.velocity.y * delta;

        if (Engine3D.camera.position.y < 1.7) {
            this.velocity.y = 0;
            Engine3D.camera.position.y = 1.7;
            this.canJump = true;
        }

        const isMoving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
        if (isMoving && this.canJump) {
            this.headBobTimer += delta * 10;
            if (Math.sin(this.headBobTimer) < -0.95) {
                AudioEngine.playStep();
            }
        }

        const limit = Engine3D.currentLocation === 'apartment' ? 4.5 : 12.5;
        Engine3D.camera.position.x = Math.max(-limit, Math.min(limit, Engine3D.camera.position.x));
        Engine3D.camera.position.z = Math.max(-limit, Math.min(limit, Engine3D.camera.position.z));

        this.checkInteraction();
    },

    checkInteraction() {
        if (typeof THREE === 'undefined' || !Engine3D.camera) return;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), Engine3D.camera);
        const intersects = raycaster.intersectObjects(Engine3D.interactiveObjects, false);

        const promptEl = document.getElementById('interaction-prompt');
        const promptText = document.getElementById('prompt-text');
        const reticle = document.getElementById('reticle');

        if (intersects.length > 0 && intersects[0].distance < 3.2) {
            const target = intersects[0].object.userData;
            if (target && target.isInteractive) {
                this.currentInteractable = target;
                promptEl.style.display = 'block';
                promptText.innerText = target.prompt;
                reticle.classList.add('active');
                return;
            }
        }

        this.currentInteractable = null;
        promptEl.style.display = 'none';
        reticle.classList.remove('active');
    }
};

/**
 * GAME APP & MODAL CONTROLLER
 */
/**
 * SERVER TERMINAL & DEVOPS INCIDENTS SYSTEM
 */

/**
 * HIRING & HH.RU JOB SEARCH SYSTEM
 */
const HiringEngine = {
    vacancies: [
        {
            id: 'vac-aura',
            title: 'Trainee / Junior Backend Developer (Python)',
            company: 'AuraCloud Solutions',
            salary: '75 000 ₽ на руки',
            reqSkills: ['py', 'sql', 'git'],
            reqText: 'Python, базовый SQL, Git. Обучение в сильной команде, БЦ "Сенатор".',
            desc: 'Разработка микросервисов, обработка платежей, работа с базами данных.'
        },
        {
            id: 'vac-support',
            title: 'Младший специалист L2 техподдержки',
            company: 'ООО "Вектор-ИТ"',
            salary: '45 000 ₽ на руки',
            reqSkills: ['linux', 'git'],
            reqText: 'Linux, Git, ответственность. Мониторинг логов и эникей-задачи.',
            desc: 'Работа в сменном графике, обработка обращений пользователей.'
        },
        {
            id: 'vac-devops',
            title: 'Junior DevOps / Младший администратор дата-центра',
            company: 'Дата-центр "Север"',
            salary: '80 000 ₽ на руки',
            reqSkills: ['linux', 'docker'],
            reqText: 'Linux, Docker, базовые сети. Работа с серверными стойками.',
            desc: 'Обслуживание инфраструктуры, перезапуск контейнеров, дежурства.'
        }
    ],

    init() {
        this.renderVacancies();
        this.updateStatusPill();
    },

    toggleSkill(skillId) {
        AudioEngine.playClick();
        const idx = Game.state.career.mySkills.indexOf(skillId);
        const btn = document.getElementById('skill-' + skillId);

        if (idx === -1) {
            Game.state.career.mySkills.push(skillId);
            if (btn) btn.classList.add('active');
            GameApp.showToast('Навык добавлен', 'Вы указали этот навык в резюме.');
        } else {
            Game.state.career.mySkills.splice(idx, 1);
            if (btn) btn.classList.remove('active');
            GameApp.showToast('Навык удален', 'Навык убран из резюме.');
        }
        this.renderVacancies();
    },

    updateStatusPill() {
        const pill = document.getElementById('hh-status-pill');
        if (!pill) return;

        if (Game.state.career.isEmployed) {
            pill.innerText = '● Статус: Трудоустроен в ' + Game.state.career.company;
            pill.style.color = '#4ade80';
            pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            pill.style.background = 'rgba(16, 185, 129, 0.15)';
        } else if (Game.state.career.appliedVacancy) {
            const v = Game.state.career.appliedVacancy;
            if (v.status === 'invited') {
                pill.innerText = '● Вас пригласили на собеседование в ' + v.company + '!';
                pill.style.color = '#38bdf8';
                pill.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                pill.style.background = 'rgba(56, 189, 248, 0.15)';
            } else {
                pill.innerText = '● Резюме на рассмотрении в ' + v.company + ' (ожидайте 1 день)';
                pill.style.color = '#fbbf24';
                pill.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                pill.style.background = 'rgba(245, 158, 11, 0.15)';
            }
        } else {
            pill.innerText = '● Статус: Безработный (Активный поиск)';
            pill.style.color = '#f87171';
            pill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            pill.style.background = 'rgba(239, 68, 68, 0.15)';
        }
    },

    renderVacancies() {
        const list = document.getElementById('hh-vacancies-list');
        if (!list) return;
        list.innerHTML = '';

        this.vacancies.forEach(vac => {
            const hasAllSkills = vac.reqSkills.every(s => Game.state.career.mySkills.includes(s));
            const card = document.createElement('div');
            card.className = 'vacancy-card';

            const isApplied = Game.state.career.appliedVacancy && Game.state.career.appliedVacancy.id === vac.id;
            let actionBtnHtml = '';

            if (Game.state.career.isEmployed) {
                actionBtnHtml = '<span style="color:#64748b; font-size:12px;">Вы уже работаете</span>';
            } else if (isApplied) {
                if (Game.state.career.appliedVacancy.status === 'invited') {
                    actionBtnHtml = '<button class="ide-btn" style="background:#0284c7; border-color:#38bdf8; color:#fff;" onclick="GameApp.closeModal(); GameApp.openCommuteDialog();">🚪 Ехать на собеседование</button>';
                } else {
                    actionBtnHtml = '<span style="color:#fbbf24; font-size:12px; font-weight:600;">⏳ На рассмотрении</span>';
                }
            } else {
                actionBtnHtml = `<button class="ide-btn" style="${hasAllSkills ? 'background:#2563eb; border-color:#3b82f6; color:#fff;' : 'background:#334155; opacity:0.8;'}" onclick="HiringEngine.apply('${vac.id}')">Откликнуться на вакансию</button>`;
            }

            card.innerHTML = `
                <div style="flex:1;">
                    <div class="vac-title">${vac.title}</div>
                    <div class="vac-company">🏢 ${vac.company}</div>
                    <div class="vac-salary">${vac.salary}</div>
                    <div class="vac-reqs">Требования: ${vac.reqText}</div>
                    <div style="font-size:11px; color:#64748b; margin-top:4px;">${vac.desc}</div>
                </div>
                <div>${actionBtnHtml}</div>
            `;
            list.appendChild(card);
        });
    },

    apply(vacId) {
        AudioEngine.playSuccess();
        const vac = this.vacancies.find(v => v.id === vacId);
        if (!vac) return;

        const hasAllSkills = vac.reqSkills.every(s => Game.state.career.mySkills.includes(s));
        if (!hasAllSkills) {
            if (!confirm('В вашем резюме указаны не все требуемые навыки для этой вакансии. Всё равно отправить отклик?')) {
                return;
            }
        }

        Game.state.career.appliedVacancy = {
            id: vac.id,
            title: vac.title,
            company: vac.company,
            status: 'applied',
            appliedDay: Game.state.dayIndex
        };

        this.updateStatusPill();
        this.renderVacancies();
        GameApp.showToast('Отклик отправлен!', `Резюме ушло в ${vac.company}. Ответ придёт на следующий день.`, 'success');
    },

    cancelInterview() {
        document.getElementById('interview-modal').style.display = 'none';
        document.getElementById('interactive-overlay').style.display = 'none';
        document.getElementById('game-canvas').requestPointerLock();
    }
};

/**
 * TECHNICAL INTERVIEW ENGINE (Собеседование)
 */
const InterviewEngine = {
    questions: [
        {
            title: '1. Вопрос по языку Python',
            text: 'В чём ключевое различие между списком (list) и кортежем (tuple) в Python?',
            answers: [
                { text: 'Кортеж неизменяемый (immutable), а элементы списка можно добавлять и удалять.', isCorrect: true },
                { text: 'Список работает только с целыми числами, а кортеж со строками.', isCorrect: false },
                { text: 'Разницы нет, это устаревшие синонимы из ранних версий Python.', isCorrect: false }
            ]
        },
        {
            title: '2. Вопрос по системе контроля версий Git',
            text: 'Что происходит при выполнении команды git commit -m "feat: add api"?',
            answers: [
                { text: 'Код мгновенно загружается на удаленный сервер GitHub.', isCorrect: false },
                { text: 'Изменения из индекса (staging) фиксируются в локальной истории репозитория.', isCorrect: true },
                { text: 'Все измененные файлы стираются с жесткого диска.', isCorrect: false }
            ]
        },
        {
            title: '3. Вопрос по базам данных и SQL',
            text: 'Какой SQL-запрос выберет пользователей со статусом "active" и возрастом от 18 лет?',
            answers: [
                { text: 'SELECT * FROM users WHERE status = \'active\' AND age >= 18;', isCorrect: true },
                { text: 'GET USERS WITH status == \'active\' OR age > 18;', isCorrect: false },
                { text: 'FILTER users BY status AND age > 18;', isCorrect: false }
            ]
        },
        {
            title: '4. Вопрос по архитектуре и производительности',
            text: 'Что такое проблема N+1 запросов при работе с реляционными базами данных?',
            answers: [
                { text: 'Это когда база автоматически кэширует ровно N+1 результатов.', isCorrect: false },
                { text: 'Это когда в цикле для каждой из N записей делается отдельный SQL-запрос, перегружая БД.', isCorrect: true },
                { text: 'Это ошибка компилятора, возникающая при нехватке оперативной памяти.', isCorrect: false }
            ]
        }
    ],

    start() {
        Game.state.career.interviewScore = 0;
        Game.state.career.interviewCurrentQ = 0;

        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        document.getElementById('domestic-modal').style.display = 'none';
        document.getElementById('interview-modal').style.display = 'flex';

        this.renderCurrentQuestion();
    },

    renderCurrentQuestion() {
        const qIndex = Game.state.career.interviewCurrentQ;
        const total = this.questions.length;
        document.getElementById('interview-progress-pill').innerText = `Вопрос ${qIndex + 1} из ${total}`;

        const q = this.questions[qIndex];
        document.getElementById('interview-question-text').innerText = `${q.title}:\n${q.text}`;

        const answersList = document.getElementById('interview-answers-list');
        answersList.innerHTML = '';

        q.answers.forEach((ans, idx) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerText = ans.text;
            btn.onclick = () => this.handleAnswer(ans.isCorrect);
            answersList.appendChild(btn);
        });
    },

    handleAnswer(isCorrect) {
        AudioEngine.playClick();
        if (isCorrect) {
            Game.state.career.interviewScore++;
            GameApp.showToast('Ответ принят', 'Тимлид кивнул с одобрением.', 'success');
        } else {
            GameApp.showToast('Ответ принят', 'Тимлид сделал пометку в блокноте.', 'warning');
        }

        Game.state.career.interviewCurrentQ++;

        if (Game.state.career.interviewCurrentQ < this.questions.length) {
            this.renderCurrentQuestion();
        } else {
            this.finishInterview();
        }
    },

    finishInterview() {
        const score = Game.state.career.interviewScore;
        const passed = score >= 3;

        const answersList = document.getElementById('interview-answers-list');
        answersList.innerHTML = '';

        if (passed) {
            AudioEngine.playSuccess();
            Game.state.career.isEmployed = true;
            Game.state.career.title = 'Trainee / Junior Backend Developer';
            Game.state.career.company = 'AuraCloud Solutions';
            Game.state.finances.salary = 75000;
            Game.state.career.reputation = 50;

            document.getElementById('interview-question-text').innerHTML = `
                <div style="color:#4ade80; font-size:18px; font-weight:700; margin-bottom:10px;">
                    🎉 Поздравляем! Вы прошли собеседование (${score} из 4 верно)!
                </div>
                <div style="line-height:1.6; color:#e2e8f0;">
                    Тимлид Артём: <em>"Отличные фундаментальные знания! Мы готовы сделать вам оффер на позицию <strong>Trainee / Junior Backend Developer</strong> с окладом <strong>75 000 ₽</strong>. Вот ваш электронный пропуск. Теперь вы полноправный сотрудник компании! Ваше рабочее место в центре зала, подключайтесь к спринту."</em>
                </div>
            `;

            const btn = document.createElement('button');
            btn.className = 'ide-btn';
            btn.style.cssText = 'background:#2563eb; color:#fff; padding:12px 24px; font-size:14px; margin-top:14px; align-self:flex-start;';
            btn.innerText = '🚀 Принять оффер и занять рабочее место';
            btn.onclick = () => {
                HiringEngine.cancelInterview();
                GameApp.updateHUD();
                GameApp.showToast('Трудоустройство оформлено!', 'Вы приняты в штат AuraCloud Solutions. Оклад 75 000 ₽.', 'success');
            };
            answersList.appendChild(btn);

        } else {
            document.getElementById('interview-question-text').innerHTML = `
                <div style="color:#f87171; font-size:18px; font-weight:700; margin-bottom:10px;">
                    Результат собеседования: ${score} из 4
                </div>
                <div style="line-height:1.6; color:#cbd5e1;">
                    Тимлид Артём: <em>"К сожалению, сегодня правильных ответов не хватило для оффера. Рекомендую дома перечитать основы Python и SQL, подтянуть теорию и через пару дней откликнуться снова на hh.ru."</em>
                </div>
            `;

            const btn = document.createElement('button');
            btn.className = 'ide-btn';
            btn.style.cssText = 'padding:10px 20px; margin-top:14px;';
            btn.innerText = 'Вернуться домой готовиться';
            btn.onclick = () => {
                HiringEngine.cancelInterview();
                GameApp.travelTo('apartment', 'metro', 57, 45);
            };
            answersList.appendChild(btn);
        }

        HiringEngine.updateStatusPill();
        GameApp.updateHUD();
    }
};


const ServerTerminal = {
    history: [],
    historyIndex: -1,
    activeIncidentId: 'srv-1',
    serverTasks: [
        {
            id: 'srv-1',
            key: 'SRV-01',
            title: 'Упал Gunicorn/Nginx бэкенда (502 Bad Gateway)',
            desc: 'Веб-сервер Nginx возвращает 502. Процесс gunicorn завершился со сбоем.',
            status: 'firing', // firing or resolved
            reward: 12000,
            exp: 55,
            expectedCmd: 'systemctl restart gunicorn',
            hint: 'Выполните команду: systemctl restart gunicorn (или systemctl restart nginx)',
            check: (cmd) => cmd.includes('systemctl restart gunicorn') || cmd.includes('systemctl start gunicorn')
        },
        {
            id: 'srv-2',
            key: 'SRV-02',
            title: 'Утечка памяти и 100% CPU процессом leak_worker (PID 4120)',
            desc: 'Фоновый воркер вошел в бесконечный цикл. Нагрузка на все ядра 100%.',
            status: 'firing',
            reward: 14000,
            exp: 60,
            expectedCmd: 'kill -9 4120',
            hint: 'Найдите зависший процесс через top или ps aux и завершите его: kill -9 4120',
            check: (cmd) => cmd.includes('kill -9 4120') || cmd.includes('kill 4120')
        },
        {
            id: 'srv-3',
            key: 'SRV-03',
            title: 'Переполнение дискового пространства (/var/log забит на 100%)',
            desc: 'Диск sda1 заполнен на 100%. Сервисы не могут писать временные файлы.',
            status: 'firing',
            reward: 11000,
            exp: 50,
            expectedCmd: 'rm -f /var/log/syslog.old',
            hint: 'Очистите лог: rm -f /var/log/syslog.old или truncate -s 0 /var/log/syslog',
            check: (cmd) => cmd.includes('rm ') || cmd.includes('truncate') || cmd.includes('clean')
        },
        {
            id: 'srv-4',
            key: 'SRV-04',
            title: 'Упал Docker контейнер базы данных postgres-db',
            desc: 'Контейнер БД перешел в статус Exited (1) из-за нехватки shared memory.',
            status: 'firing',
            reward: 15000,
            exp: 65,
            expectedCmd: 'docker restart postgres-db',
            hint: 'Перезапустите упавший контейнер: docker restart postgres-db',
            check: (cmd) => cmd.includes('docker restart postgres') || cmd.includes('docker start postgres')
        }
    ],

    startGame() {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        PlayerController.isStarted = true;
        try {
            AudioEngine.init();
        } catch(e) {}
        try {
            const canvas = document.getElementById('game-canvas');
            canvas.requestPointerLock();
        } catch(e) {}
        this.showToast('Симуляция запущена', 'Вы в игре! Используйте WASD для ходьбы и [E] для взаимодействия.');
    },

    init() {
        const input = document.getElementById('terminal-input');
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.executeCommand(cmd);
                }
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.history[this.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    input.value = this.history[this.historyIndex] || '';
                } else {
                    this.historyIndex = this.history.length;
                    input.value = '';
                }
            }
        });
    },

    open() {
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        document.getElementById('domestic-modal').style.display = 'none';
        document.getElementById('server-terminal-window').style.display = 'flex';

        this.renderTasksList();
        const screen = document.getElementById('terminal-screen');
        if (!screen.innerHTML) {
            screen.innerHTML = `<span class="out-info">Linux srv-core-01.dc.aura.ru 5.15.0-89-generic #99-Ubuntu SMP x86_64</span>\\n` +
                               `<span class="out-ok">Welcome to AuraCloud Datacenter Server Console (Rack #4)</span>\\n` +
                               `Система мониторинга зафиксировала 4 аварийных инцидента.\\n` +
                               `Введите <span class="out-info">help</span> для списка команд или выберите инцидент слева.\\n\\n`;
        }
        document.getElementById('terminal-input').focus();
    },

    renderTasksList() {
        const list = document.getElementById('server-tasks-list');
        list.innerHTML = '';
        this.serverTasks.forEach(task => {
            const card = document.createElement('div');
            card.className = `server-task-card ${task.id === this.activeIncidentId ? 'active' : ''} ${task.status === 'resolved' ? 'done' : ''}`;
            card.onclick = () => this.selectIncident(task.id);
            card.innerHTML = `
                <div class="server-task-header">
                    <span style="font-weight:700; color:#38bdf8;">${task.key}</span>
                    <span class="server-badge ${task.status === 'resolved' ? 'badge-fixed' : 'badge-alert'}">
                        ${task.status === 'resolved' ? 'РЕШЕНО' : 'АВАРИЯ'}
                    </span>
                </div>
                <div class="server-task-title">${task.title}</div>
                <div class="server-task-desc">${task.desc}</div>
                <div style="font-size:10px; color:#4ade80; margin-top:4px;">+${task.reward} ₽ • +${task.exp} EXP</div>
            `;
            list.appendChild(card);
        });
    },

    selectIncident(id) {
        this.activeIncidentId = id;
        this.renderTasksList();
        const task = this.serverTasks.find(t => t.id === id);
        if (task) {
            this.printOutput(`\\n<span class="out-info">--- Выбран инцидент [${task.key}]: ${task.title} ---</span>\\n` +
                             `Подсказка: ${task.hint}\\n`);
        }
    },

    printOutput(text) {
        const screen = document.getElementById('terminal-screen');
        screen.innerHTML += text + '\\n';
        screen.scrollTop = screen.scrollHeight;
    },

    execQuick(cmd) {
        this.executeCommand(cmd);
    },

    runAutoFix() {
        const task = this.serverTasks.find(t => t.id === this.activeIncidentId);
        if (!task) return;
        this.executeCommand(task.expectedCmd);
    },

    executeCommand(cmd) {
        AudioEngine.playClick();
        this.printOutput(`<span class="prompt-user">root@srv-core-01</span>:<span class="prompt-host">~#</span> ${cmd}`);

        const clean = cmd.trim().toLowerCase();

        // 1. Check for Active Incident Resolution
        const task = this.serverTasks.find(t => t.id === this.activeIncidentId);
        if (task && task.status === 'firing' && task.check(clean)) {
            task.status = 'resolved';
            AudioEngine.playSuccess();
            Game.state.finances.rubles += task.reward;
            Game.state.career.experience += task.exp;
            GameApp.updateHUD();
            this.renderTasksList();

            this.printOutput(`\\n<span class="out-ok">[OK] Команда успешно выполнена!</span>\\n` +
                             `<span class="out-ok">🎉 Инцидент ${task.key} ликвидирован! Сервис восстановлен.</span>\\n` +
                             `<span class="out-ok">Вам начислена премия: +${task.reward} ₽ и +${task.exp} опыта DevOps.</span>\\n`);
            GameApp.showToast('Инцидент устранен!', `${task.key} решен. Начислено +${task.reward} ₽.`, 'success');
            return;
        }

        // 2. Built-in Linux Commands
        if (clean === 'help' || clean === '?') {
            this.printOutput(`Доступные команды:\\n` +
                             `  systemctl status/restart [service]   - управление системными службами\\n` +
                             `  docker ps / docker restart [name]    - управление контейнерами\\n` +
                             `  top / htop / ps aux                  - мониторинг процессов и памяти\\n` +
                             `  kill -9 [PID]                        - завершение зависшего процесса\\n` +
                             `  df -h                                - проверка свободного места на дисках\\n` +
                             `  rm -f [file]                         - удаление переполненных файлов логов\\n` +
                             `  uptime, free -m, whoami, clear       - служебная информация\\n` +
                             `  autofix                              - автоустранение активной аварии\\n`);
        } else if (clean === 'clear') {
            document.getElementById('terminal-screen').innerHTML = '';
        } else if (clean === 'df -h') {
            this.printOutput(`Filesystem      Size  Used Avail Use% Mounted on\\n` +
                             `/dev/sda1        80G   79G  1.0G  99% /\\n` +
                             `/dev/nvme0n1    400G  120G  280G  30% /data\\n` +
                             `<span class="out-warn">ВНИМАНИЕ: Корневой раздел /dev/sda1 заполнен на 99%!</span>`);
        } else if (clean.startsWith('top') || clean === 'ps aux' || clean === 'ps') {
            this.printOutput(`PID  USER     PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\\n` +
                             `<span class="out-err">4120 root     20   0 2480120 1.2g   4820 R 100.0  38.2  42:15.12 leak_worker.py</span>\\n` +
                             ` 890 www-data 20   0  124800  28400  1200 S   4.2   1.1   0:14.22 nginx: worker\\n` +
                             `1204 postgres 20   0  482000 180000 120000 S   2.1   4.5   1:02.10 postgres: writer\\n` +
                             `   1 root     20   0  168200  12040   8200 S   0.0   0.4   0:04.18 /sbin/init\\n` +
                             `<span class="out-warn">Обнаружен процесс 4120 с потреблением CPU 100%! Завершите его: kill -9 4120</span>`);
        } else if (clean === 'docker ps' || clean === 'docker ps -a') {
            this.printOutput(`CONTAINER ID   IMAGE                 COMMAND                  STATUS                       NAMES\\n` +
                             `<span class="out-err">a8f9b1c20e11   postgres:15-alpine    "docker-entrypoint.s…"   Exited (1) 14 minutes ago    postgres-db</span>\\n` +
                             `c3d4e5f60a22   redis:7-alpine        "docker-entrypoint.s…"   Up 4 hours (healthy)         redis-cache\\n` +
                             `e7f8a9b01c33   grafana/grafana:9.4   "/run.sh"                Up 4 hours                   grafana-metrics\\n` +
                             `<span class="out-warn">Контейнер postgres-db упал! Перезапустите: docker restart postgres-db</span>`);
        } else if (clean.startsWith('systemctl status')) {
            const svc = clean.split(' ')[2] || 'service';
            if (svc === 'gunicorn') {
                this.printOutput(`● gunicorn.service - AuraCore Web WSGI Server\\n` +
                                 `     Loaded: loaded (/etc/systemd/system/gunicorn.service; enabled)\\n` +
                                 `     <span class="out-err">Active: failed (Result: exit-code)</span> since Mon 2026-10-05 09:12:04 MSK\\n` +
                                 `    Process: 2810 ExecStart=/usr/local/bin/gunicorn (code=exited, status=1/FAILURE)\\n` +
                                 `   Main PID: 2810 (code=exited, status=1/FAILURE)\\n` +
                                 `<span class="out-warn">Служба упала! Перезапустите: systemctl restart gunicorn</span>`);
            } else {
                this.printOutput(`● ${svc}.service\\n     Active: <span class="out-ok">active (running)</span> since 08:00:00 MSK`);
            }
        } else if (clean === 'whoami') {
            this.printOutput(`root`);
        } else if (clean === 'uptime') {
            this.printOutput(` 11:34:02 up 142 days,  3:18,  2 users,  load average: 8.42, 6.18, 4.02`);
        } else if (clean === 'free -m' || clean === 'free') {
            this.printOutput(`               total        used        free      shared  buff/cache   available\\n` +
                             `Mem:           32140       28410        1240        1200        2490        2490\\n` +
                             `Swap:           8192        4020        4172`);
        } else if (clean === 'autofix') {
            this.runAutoFix();
        } else {
            this.printOutput(`bash: ${cmd}: команда не найдена. Введите 'help' для справки.`);
        }
    }
};

const GameApp = {
    startGame() {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        PlayerController.isStarted = true;
        try {
            AudioEngine.init();
        } catch(e) {}
        try {
            const canvas = document.getElementById('game-canvas');
            canvas.requestPointerLock();
        } catch(e) {}
        this.showToast('Симуляция запущена', 'Вы в игре! Используйте WASD для ходьбы и [E] для взаимодействия.');
    },

    init() {
        Engine3D.init();
        HiringEngine.init();
        ServerTerminal.init();
        PlayerController.init();
        this.updateHUD();
        this.populateIDE();
        this.populateBoard();
        this.renderChatMessages();

        // Game loop tick (1 real sec = 1 game min)
        setInterval(() => {
            this.gameTick();
        }, 1200);

        let prevTime = performance.now();
        const animate = () => {
            requestAnimationFrame(animate);
            const time = performance.now();
            const delta = (time - prevTime) / 1000;
            prevTime = time;

            PlayerController.update(delta);
            if (Engine3D.isFallback2D) {
                Engine3D.renderFallback2D();
            } else if (Engine3D.renderer && Engine3D.scene && Engine3D.camera) {
                Engine3D.renderer.render(Engine3D.scene, Engine3D.camera);
            }
        };
        animate();

        this.showToast('Добро пожаловать в симуляцию', 'Вы — Junior Backend разработчик. Осмотрите квартиру и отправляйтесь на работу или сядьте за ПК.');
    },

    gameTick() {
        Game.state.time += 1;
        if (Game.state.time >= 24 * 60) {
            Game.state.time = 0;
            Game.state.dayIndex = (Game.state.dayIndex + 1) % 7;
            this.showToast('Новый день', `Наступил ${Game.state.days[Game.state.dayIndex]}.`);
        }

        if (Math.random() < 0.15) {
            Game.state.vitals.hunger = Math.max(0, Game.state.vitals.hunger - 1);
            Game.state.vitals.energy = Math.max(0, Game.state.vitals.energy - 1);
        }

        this.updateHUD();
    },

    generateDailyTasks() {
        // Check job application progression
        if (!Game.state.career.isEmployed && Game.state.career.appliedVacancy) {
            if (Game.state.career.appliedVacancy.status === 'applied') {
                Game.state.career.appliedVacancy.status = 'invited';
                HiringEngine.updateStatusPill();
                HiringEngine.renderVacancies();
                this.showToast('🔔 Приглашение на собеседование!', 'Тимлид Артём рассмотрел резюме и ждёт вас в БЦ "Сенатор" (переговорка "Байкал")!', 'success');
            }
        }

        const day = Game.state.days[Game.state.dayIndex];
        AudioEngine.playNotification();

        // 1. Reset finished tasks or add dynamic fresh pool
        const freshTaskPool = [
            {
                id: 'task-dyn-' + Date.now(),
                key: 'INC-' + Math.floor(100 + Math.random() * 900),
                title: 'Оптимизация кэширования профилей в Redis (' + day + ')',
                type: 'feat',
                status: 'todo',
                points: 3,
                rewardRub: 9000,
                exp: 45,
                filename: 'cache_service.py',
                hint: 'Добавьте TTL кэша при записи: r.set(key, val, ex=3600)',
                brokenCode: '# CACHE FIX\\ndef save_profile(key, val):\\n    # ОШИБКА: нет TTL\\n    r.set(key, val)',
                fixedCode: '# CACHE FIX (FIXED)\\ndef save_profile(key, val):\\n    r.set(key, val, ex=3600)',
                testSnippet: 'assert r.ttl(key) > 0'
            },
            {
                id: 'task-dyn2-' + Date.now(),
                key: 'SEC-' + Math.floor(100 + Math.random() * 900),
                title: 'Санитизация входящих параметров от SQL инъекций',
                type: 'bug',
                status: 'todo',
                points: 2,
                rewardRub: 8000,
                exp: 40,
                filename: 'query_builder.py',
                hint: 'Используйте параметризованный запрос $1 вместо конкатенации строк.',
                brokenCode: '# SQL FIX\\ndef find_user(name):\\n    return db.query(f"SELECT * FROM users WHERE name = \'{name}\'")',
                fixedCode: '# SQL FIX (FIXED)\\ndef find_user(name):\\n    return db.query("SELECT * FROM users WHERE name = $1", name)',
                testSnippet: "assert find_user('admin\' OR 1=1--') is not None"
            }
        ];

        // Add 2 fresh tasks to active tasks list
        freshTaskPool.forEach(t => Game.state.tasks.unshift(t));
        this.populateIDE();
        this.populateBoard();

        // Refresh Server Incidents
        ServerTerminal.serverTasks.forEach(t => {
            if (Math.random() > 0.4) t.status = 'firing';
        });
        if (document.getElementById('server-tasks-list')) {
            ServerTerminal.renderTasksList();
        }

        // Add new morning message in Matterchat
        Game.state.chatMessages.backend.push({
            sender: 'Артем Савельев',
            role: 'Team Lead',
            time: '08:30',
            text: `Доброе утро, команда! Сегодня ${day}. Проверьте доску задач и загляните в серверную, если придут алерты от SRE.`
        });
        this.renderChatMessages();

        this.showToast('📅 Новый рабочий день!', `Наступил ${day}. Добавлены свежие задачи и инциденты на серверах.`, 'info');
    },


    updateHUD() {
        const hours = Math.floor(Game.state.time / 60).toString().padStart(2, '0');
        const minutes = (Game.state.time % 60).toString().padStart(2, '0');
        document.getElementById('hud-clock').innerText = `${hours}:${minutes}`;
        document.getElementById('hud-day').innerText = Game.state.days[Game.state.dayIndex];

        let locName = 'Квартира (Девяткино / Мурино)';
        if (Game.state.location === 'office') locName = 'БЦ "Сенатор" • IT Офис';
        else if (Game.state.location === 'server_room') locName = '🏢 Серверная стойка #4 (Data Center)';
        document.getElementById('hud-location-text').innerText = locName;

        document.getElementById('val-energy').innerText = `${Game.state.vitals.energy}%`;
        document.getElementById('bar-energy').style.width = `${Game.state.vitals.energy}%`;

        document.getElementById('val-hunger').innerText = `${Game.state.vitals.hunger}%`;
        document.getElementById('bar-hunger').style.width = `${Game.state.vitals.hunger}%`;

        document.getElementById('val-stress').innerText = `${Game.state.vitals.stress}%`;
        document.getElementById('bar-stress').style.width = `${Game.state.vitals.stress}%`;

        document.getElementById('val-health').innerText = `${Game.state.vitals.health}%`;
        document.getElementById('bar-health').style.width = `${Game.state.vitals.health}%`;

        document.getElementById('hud-money').innerText = `${Game.state.finances.rubles.toLocaleString('ru-RU')} ₽`;
        document.getElementById('bank-card-balance').innerText = `${Game.state.finances.rubles.toLocaleString('ru-RU')} ₽`;
        document.getElementById('hud-grade').innerText = Game.state.career.title;
    },

    showToast(title, body, type = 'info') {
        AudioEngine.playNotification();
        const center = document.getElementById('notification-center');
        const toast = document.createElement('div');
        toast.className = `toast-msg ${type}`;
        toast.innerHTML = `
            <div class="toast-title">
                <span>${title}</span>
                <span style="font-size:10px; color:#64748b;">сейчас</span>
            </div>
            <div class="toast-body">${body}</div>
        `;
        center.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => { if (typeof toast.remove === 'function') toast.remove(); else if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
        }, 5000);
    },

    closeModal() {
        document.getElementById('interactive-overlay').style.display = 'none';
        document.getElementById('os-window').style.display = 'none';
        document.getElementById('domestic-modal').style.display = 'none';
        if (document.getElementById('server-terminal-window')) {
            document.getElementById('server-terminal-window').style.display = 'none';
        }
        document.getElementById('game-canvas').requestPointerLock();
    },

    openWorkstation() {
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'flex';
        document.getElementById('domestic-modal').style.display = 'none';
        if (!Game.state.career.isEmployed) {
            this.switchApp('hh');
        } else {
            this.switchApp('ide');
        }
    },

    switchApp(appId) {
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.os-tab-btn').forEach(b => b.classList.remove('active'));

        document.getElementById(`app-${appId}`).classList.add('active');
        document.getElementById(`tab-btn-${appId}`).classList.add('active');

        if (appId === 'chat') {
            document.getElementById('chat-tab-unread').style.display = 'none';
        }
    },

    populateIDE() {
        const list = document.getElementById('ide-task-list');
        list.innerHTML = '';
        Game.state.tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item ${task.id === Game.state.currentActiveTaskId ? 'active' : ''} ${task.status === 'done' ? 'done' : ''}`;
            const badgeClass = task.type === 'bug' ? 'badge-bug' : task.type === 'feat' ? 'badge-feat' : 'badge-refactor';
            item.innerHTML = `
                <span class="task-badge ${badgeClass}">${task.key}</span>
                <div class="task-title">${task.title}</div>
                <div class="task-reward">
                    <span>+${task.rewardRub} ₽</span>
                    <span>${task.status === 'done' ? '✅ Смержено' : `${task.points} SP`}</span>
                </div>
            `;
            item.onclick = () => this.selectTask(task.id);
            list.appendChild(item);
        });

        this.loadTaskCode(Game.state.currentActiveTaskId);
    },

    selectTask(taskId) {
        Game.state.currentActiveTaskId = taskId;
        this.populateIDE();
        this.loadTaskCode(taskId);
    },

    toggleHint() {
        AudioEngine.playClick();
        const banner = document.getElementById('ide-hint-banner');
        if (banner) {
            banner.style.display = banner.style.display === 'none' ? 'block' : 'none';
        }
    },


    checkTaskSolved(task, code) {
        if (!task) return false;
        if (task.testsPassed) return true;

        const cleanUser = (code || '').replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
        const cleanFixed = (task.fixedCode || '').replace(/\\n/g, '\n').replace(/\s+/g, ' ').trim();
        const cleanBroken = (task.brokenCode || '').replace(/\\n/g, '\n').replace(/\s+/g, ' ').trim();

        if (cleanUser === cleanFixed) return true;

        // Task-specific rule verification
        if (task.key === 'START-101' || task.filename === 'settings.py') {
            return code.includes('DEBUG = False') && (code.includes('8080') || code.includes('PORT = 8080'));
        }
        if (task.key === 'CALC-102' || task.filename === 'pricing.py') {
            return code.includes('price - discount');
        }
        if (task.key === 'AUTH-103' || task.filename === 'auth.py') {
            return code.includes('len(password) >= 8') || code.includes('len(password) > 7');
        }
        if (task.key === 'FIX-104' || task.filename === 'connection_pool.py') {
            return code.includes('async with self.pool.acquire') || code.includes('finally:');
        }
        if (task.key === 'FEAT-202' || task.filename === 'payment_service.py') {
            return code.includes('nx=True') || (code.includes('idempotency_key') && code.includes('DUPLICATE_IGNORED'));
        }
        if (task.key === 'PERF-88' || task.filename === 'transaction_report.py') {
            return code.includes('IN (') || code.includes('defaultdict') || code.includes('all_orders');
        }
        if (task.filename === 'query_builder.py' || (task.key && task.key.startsWith('SEC'))) {
            return code.includes('$1') || code.includes('?') || code.includes('%s') || code.includes('name,') || code.includes('$1", name');
        }
        if (task.filename === 'cache_service.py' || (task.key && task.key.startsWith('INC'))) {
            return code.includes('ex=') || code.includes('ttl=') || code.includes('3600');
        }

        if (cleanUser !== cleanBroken && (cleanUser.includes('FIXED') || cleanUser.length >= cleanBroken.length * 0.7)) {
            return true;
        }
        return false;
    },

    autoFixCode() {
        AudioEngine.playSuccess();
        const task = Game.state.tasks.find(t => t.id === Game.state.currentActiveTaskId);
        if (!task) return;
        const editor = document.getElementById('code-editor');
        editor.value = (task.fixedCode || '').replace(/\\n/g, '\n');
        task.testsPassed = true;
        this.showToast('🪄 Решение вставлено', 'Код обновлен и тесты пройдены! Нажмите "🚀 Git Commit & PR".', 'success');

        const pill = document.getElementById('test-status-pill');
        if (pill) pill.innerHTML = '<span style="color:#4ade80">● Tests Passed</span>';

        const terminal = document.getElementById('terminal-output');
        terminal.innerHTML = `<span class="info">$ pytest tests/test_${task.filename} -v</span>\n` +
                             `<span class="pass">PASSED: tests/test_${task.filename}::test_logic</span>\n` +
                             `<span class="pass">PASSED: tests/test_${task.filename}::test_edge_cases</span>\n\n` +
                             `<span class="pass">== 2 passed in 0.12s ==</span>\n\n` +
                             `<span class="pass">🎉 [AutoFix] Решение применено! Тесты пройдены. Нажмите "🚀 Git Commit & PR" для сдачи задачи.</span>`;
        this.updateHUD();
    },

    loadTaskCode(taskId) {
        const task = Game.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('ide-file-name').innerText = `📄 ${task.filename}`;
        const hintEl = document.getElementById('ide-hint-text');
        if (hintEl) hintEl.innerText = task.hint || 'Внимательно изучите код и комментарии к нему.';
        const editor = document.getElementById('code-editor');
        const rawCode = task.status === 'done' ? task.fixedCode : task.brokenCode;
        editor.value = (rawCode || '').replace(/\\n/g, '\n');

        const pill = document.getElementById('test-status-pill');
        if (pill) {
            pill.innerHTML = task.status === 'done' ? '<span style="color:#4ade80">● Merged</span>' : 'Ready';
        }

        const terminal = document.getElementById('terminal-output');
        terminal.innerHTML = `<span class="info">$ git checkout -b feat/${task.key.toLowerCase()}</span>\nФайл: ${task.filename}\nНажмите "Запустить PyTest" или "🪄 Вставить решение"...`;
    },

    runTests() {
        AudioEngine.playClick();
        const task = Game.state.tasks.find(t => t.id === Game.state.currentActiveTaskId);
        if (!task) return;
        const editor = document.getElementById('code-editor');
        const code = editor.value;

        const terminal = document.getElementById('terminal-output');
        terminal.innerHTML = `<span class="info">$ pytest tests/test_${task.filename} -v</span>\nЗапуск тестового набора [====================] 100%\n`;

        const isSolved = this.checkTaskSolved(task, code);

        if (isSolved) {
            task.testsPassed = true;
            AudioEngine.playSuccess();
            terminal.innerHTML += `\n<span class="pass">PASSED: tests/test_${task.filename}::test_logic</span>\n` +
                                  `<span class="pass">PASSED: tests/test_${task.filename}::test_edge_cases</span>\n\n` +
                                  `<span class="pass">== 2 passed in 0.18s ==</span>\n\n` +
                                  `Тесты пройдены! Нажмите "🚀 Git Commit & PR" для отправки в релиз.`;
            const pill = document.getElementById('test-status-pill');
            if (pill) pill.innerHTML = '<span style="color:#4ade80">● Tests Passed</span>';
        } else {
            task.testsPassed = false;
            terminal.innerHTML += `\n<span class="fail">FAILED: tests/test_${task.filename}::test_logic</span>\n` +
                                  `<span class="fail">AssertionError: Дефект в коде не устранен!</span>\n` +
                                  `Подсказка: ${task.hint || 'Проверьте логику'}\n\n` +
                                  `<span class="fail">== 1 failed in 0.12s ==</span>\n\n` +
                                  `<span class="info">💡 Вы можете нажать "🪄 Вставить решение", чтобы исправить код автоматически.</span>`;
            const pill = document.getElementById('test-status-pill');
            if (pill) pill.innerHTML = '<span style="color:#f87171">● Tests Failed</span>';
            Game.state.vitals.stress = Math.min(100, Game.state.vitals.stress + 2);
        }
        this.updateHUD();
    },

    commitTask() {
        const task = Game.state.tasks.find(t => t.id === Game.state.currentActiveTaskId);
        if (!task) return;
        const editor = document.getElementById('code-editor');
        const code = editor.value;

        if (task.status === 'done') {
            alert('Эта задача уже смержена в main ветку!');
            return;
        }

        const isSolved = this.checkTaskSolved(task, code);

        if (!isSolved) {
            alert('Нельзя отправить Pull Request с падающими тестами! Нажмите кнопку "🪄 Вставить решение" или исправьте ошибку.');
            return;
        }

        AudioEngine.playSuccess();
        task.status = 'done';
        task.testsPassed = true;
        Game.state.finances.rubles += task.rewardRub;
        Game.state.career.experience += task.exp;
        Game.state.career.completedTasksCount += 1;
        Game.state.vitals.energy = Math.max(10, Game.state.vitals.energy - 12);
        Game.state.vitals.stress = Math.max(0, Game.state.vitals.stress - 6);

        if (Game.state.career.experience >= Game.state.career.targetExp && Game.state.career.title.includes('Junior')) {
            Game.state.career.title = 'Middle Backend Developer';
            Game.state.finances.salary = 185000;
            this.showToast('🚀 ПОВЫШЕНИЕ!', 'Поздравляем! Вы повышены до Middle Backend Developer. Оклад увеличен до 185 000 ₽!', 'success');
        } else {
            this.showToast('PR Смержен!', `Задача ${task.key} закрыта. Получено +${task.rewardRub} ₽ и +${task.exp} опыта.`, 'success');
        }

        this.populateIDE();
        this.populateBoard();
        this.updateHUD();
    },

    populateBoard() {
        const todoEl = document.getElementById('board-todo-list');
        const progressEl = document.getElementById('board-progress-list');
        const doneEl = document.getElementById('board-done-list');

        todoEl.innerHTML = '';
        progressEl.innerHTML = '';
        doneEl.innerHTML = '';

        Game.state.tasks.forEach(t => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#1e293b; padding:10px; border-radius:6px; border:1px solid #334155; font-size:12px;';
            card.innerHTML = `<strong>${t.key}</strong>: ${t.title}<br><span style="color:#94a3b8">${t.points} SP</span>`;

            if (t.status === 'done') {
                doneEl.appendChild(card);
            } else if (t.id === Game.state.currentActiveTaskId) {
                progressEl.appendChild(card);
            } else {
                todoEl.appendChild(card);
            }
        });
    },

    selectChannel(chId) {
        Game.state.currentChatChannel = chId;
        document.querySelectorAll('.chat-channels .channel-btn').forEach(b => b.classList.remove('active'));
        this.renderChatMessages();
    },

    renderChatMessages() {
        const container = document.getElementById('chat-messages-container');
        container.innerHTML = '';
        const msgs = Game.state.chatMessages[Game.state.currentChatChannel] || [];

        msgs.forEach(m => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${m.sender === 'Вы' ? 'mine' : ''}`;
            bubble.innerHTML = `
                <div class="chat-sender-line">
                    <span class="sender-name">${m.sender}</span>
                    <span class="sender-role">${m.role}</span>
                    <span class="msg-time">${m.time}</span>
                </div>
                <div class="msg-content">${m.text}</div>
            `;
            container.appendChild(bubble);
        });
        container.scrollTop = container.scrollHeight;

        const replies = document.getElementById('chat-replies-container');
        replies.innerHTML = '';

        if (Game.state.currentChatChannel === 'lead') {
            const opt1 = document.createElement('button');
            opt1.className = 'quick-reply-btn';
            opt1.innerText = '💬 "Артем, привет! Работаю над утечкой коннектов в connection pool, сегодня сдам PR."';
            opt1.onclick = () => this.sendChatMessage('lead', opt1.innerText, 'Отлично, держи в курсе. Не забудь тесты прогнать!');
            replies.appendChild(opt1);
        } else if (Game.state.currentChatChannel === 'pm') {
            const opt2 = document.createElement('button');
            opt2.className = 'quick-reply-btn';
            opt2.innerText = '💬 "Ольга, уже реализую Redis идемпотентность для СБП. К вечеру будет в тестировании."';
            opt2.onclick = () => this.sendChatMessage('pm', opt2.innerText, 'Супер, спасибо! Бизнес будет очень доволен.');
            replies.appendChild(opt2);
        } else {
            const opt3 = document.createElement('button');
            opt3.className = 'quick-reply-btn';
            opt3.innerText = '💬 "Всем привет! Беру задачу из спринта в работу."';
            opt3.onclick = () => this.sendChatMessage(Game.state.currentChatChannel, opt3.innerText);
            replies.appendChild(opt3);
        }
    },

    sendChatMessage(channel, myText, autoReply) {
        AudioEngine.playClick();
        const cleanText = myText.replace('💬 ', '').replace(/"/g, '');
        const hours = Math.floor(Game.state.time / 60).toString().padStart(2, '0');
        const minutes = (Game.state.time % 60).toString().padStart(2, '0');

        Game.state.chatMessages[channel].push({
            sender: 'Вы',
            role: 'Junior Dev',
            time: `${hours}:${minutes}`,
            text: cleanText
        });

        this.renderChatMessages();

        if (autoReply) {
            setTimeout(() => {
                AudioEngine.playNotification();
                Game.state.chatMessages[channel].push({
                    sender: channel === 'lead' ? 'Артем Савельев' : 'Ольга Корнеева',
                    role: channel === 'lead' ? 'Team Lead' : 'Product Manager',
                    time: `${hours}:${minutes}`,
                    text: autoReply
                });
                this.renderChatMessages();
            }, 800);
        }
    },

    openBedDialog() {
        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('dom-title').innerText = '🛏️ Кровать и отдых';
        document.getElementById('dom-desc').innerText = 'Качественный сон восстанавливает энергию и снимает рабочий стресс. Переработки без сна ведут к снижению фокуса и ошибкам в коде.';

        const opts = document.getElementById('dom-options');
        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.doSleep(8)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Полноценный ночной сон (8 часов)</div>
                    <div class="action-opt-details">Энергия: +80% • Стресс: -35% • Время: перемотка на 8 часов</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doSleep(1)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Быстрый дневной сон (1 час)</div>
                    <div class="action-opt-details">Энергия: +20% • Стресс: -10% • Время: перемотка на 1 час</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
        `;
    },

    doSleep(hours) {
        AudioEngine.playSuccess();
        this.fadeTransition(() => {
            Game.state.time += hours * 60;
            Game.state.vitals.energy = Math.min(100, Game.state.vitals.energy + (hours === 8 ? 80 : 20));
            Game.state.vitals.stress = Math.max(0, Game.state.vitals.stress - (hours === 8 ? 35 : 10));
            Game.state.vitals.hunger = Math.max(0, Game.state.vitals.hunger - hours * 4);
            this.updateHUD();
            this.closeModal();
            this.showToast('Вы отдохнули', `Сон завершен. Вы чувствуете прилив сил!`);
                if (hours >= 8) GameApp.generateDailyTasks();
        });
    },

    openKitchenDialog() {
        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('dom-title').innerText = '🍳 Кухня и питание';
        document.getElementById('dom-desc').innerText = 'Выберите, чем подкрепиться. Питание восстанавливает сытость и силы.';

        const opts = document.getElementById('dom-options');
        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.doEat('pelmeni', 0, 35, 10)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Сварить пельмени со сметаной</div>
                    <div class="action-opt-details">Сытость: +35% • Энергия: +10% • Традиционный сытный перекус</div>
                </div>
                <div class="action-opt-cost">Дома</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doEat('delivery', 650, 60, 25)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Заказать доставку еды "Самокат / Яндекс Лавка"</div>
                    <div class="action-opt-details">Сытость: +60% • Энергия: +25% • Горячий поке и суп</div>
                </div>
                <div class="action-opt-cost">-650 ₽</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doDrinkTea()">
                <div class="action-opt-left">
                    <div class="action-opt-title">Вскипятить чайник и заварить крепкий чай с лимоном</div>
                    <div class="action-opt-details">Энергия: +15% • Стресс: -10%</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
        `;
    },

    doEat(type, cost, hungerGain, energyGain) {
        if (Game.state.finances.rubles < cost) {
            alert('Недостаточно денег на балансе карты!');
            return;
        }
        AudioEngine.playSuccess();
        Game.state.finances.rubles -= cost;
        Game.state.vitals.hunger = Math.min(100, Game.state.vitals.hunger + hungerGain);
        Game.state.vitals.energy = Math.min(100, Game.state.vitals.energy + energyGain);
        this.updateHUD();
        this.closeModal();
        this.showToast('Приятного аппетита!', `Сытость повышена до ${Game.state.vitals.hunger}%.`);
    },

    doDrinkTea() {
        AudioEngine.playKettle();
        Game.state.vitals.energy = Math.min(100, Game.state.vitals.energy + 15);
        Game.state.vitals.stress = Math.max(0, Game.state.vitals.stress - 10);
        this.updateHUD();
        this.closeModal();
        this.showToast('Чай готов', 'Горячий чай согревает и снимает напряжение.');
    },

    openCommuteDialog() {
        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        const career = Game.state.career;
        const opts = document.getElementById('dom-options');

        if (!career.isEmployed) {
            document.getElementById('dom-title').innerText = '🚪 Выход из квартиры';
            const isInvited = career.appliedVacancy && career.appliedVacancy.status === 'invited';

            if (isInvited) {
                document.getElementById('dom-desc').innerText = 'Вам пришло приглашение на собеседование в БЦ "Сенатор"! Выберите транспорт, чтобы поехать в офис компании на встречу с тимлидом.';
                opts.innerHTML = `
                    <div class="action-option-btn" onclick="GameApp.travelTo('office', 'metro', 57, 45)">
                        <div class="action-opt-left">
                            <div class="action-opt-title">🚇 Поехать на метро на собеседование в БЦ "Сенатор"</div>
                            <div class="action-opt-details">Время: ~45 мин • Стоимость: 57 ₽ • По карте "Тройка / Подорожник"</div>
                        </div>
                        <div class="action-opt-cost">-57 ₽</div>
                    </div>
                    <div class="action-option-btn" onclick="GameApp.travelTo('office', 'taxi', 540, 30)">
                        <div class="action-opt-left">
                            <div class="action-opt-title">🚕 Поехать на Яндекс Go (Комфорт)</div>
                            <div class="action-opt-details">Время: ~30 мин • Без толкучки, настроиться на собеседование</div>
                        </div>
                        <div class="action-opt-cost">-540 ₽</div>
                    </div>
                `;
            } else {
                document.getElementById('dom-desc').innerText = 'Вы пока безработный. Чтобы устроиться, сядьте за домашний ПК [E], откройте вкладку "hh.ru" и откликнитесь на вакансию стажёра!';
                opts.innerHTML = `
                    <div class="action-option-btn" onclick="GameApp.closeModal()">
                        <div class="action-opt-left">
                            <div class="action-opt-title">Остаться дома и искать работу на hh.ru</div>
                            <div class="action-opt-details">Сядьте за рабочий стол и отправьте отклик</div>
                        </div>
                    </div>
                `;
            }
            return;
        }

        document.getElementById('dom-title').innerText = '🚇 Поездка на работу';
        document.getElementById('dom-desc').innerText = 'Выберите способ добраться до офиса IT-компании в БЦ "Сенатор".';

        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.travelTo('office', 'metro', 57, 45)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Поехать на Метро (Карта "Подорожник / Тройка")</div>
                    <div class="action-opt-details">Время: ~45 мин • Стоимость: 57 ₽ • Легкая усталость</div>
                </div>
                <div class="action-opt-cost">-57 ₽</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.travelTo('office', 'taxi', 540, 30)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Вызвать Яндекс Go (Комфорт)</div>
                    <div class="action-opt-details">Время: ~30 мин • Комфортно, можно почитать новости</div>
                </div>
                <div class="action-opt-cost">-540 ₽</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.travelTo('office', 'remote', 0, 0)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Остаться на удаленке дома</div>
                    <div class="action-opt-details">Работать весь день за домашним ноутбуком</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
        `;
    },

    openLeaveOfficeDialog() {
        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('dom-title').innerText = '🏢 Завершение рабочего дня';
        document.getElementById('dom-desc').innerText = 'Рабочий день подходит к концу. Отправиться домой отдыхать?';

        const opts = document.getElementById('dom-options');
        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.travelTo('apartment', 'metro', 57, 45)">
                <div class="action-opt-left">
                    <div class="action-opt-title">Поехать домой на Метро</div>
                    <div class="action-opt-details">Возвращение в свою уютную квартиру</div>
                </div>
                <div class="action-opt-cost">-57 ₽</div>
            </div>
        `;
    },

    travelTo(dest, method, cost, durationMin) {
        if (Game.state.finances.rubles < cost) {
            alert('Недостаточно средств на проезд!');
            return;
        }

        AudioEngine.playSuccess();
        this.fadeTransition(() => {
            Game.state.finances.rubles -= cost;
            Game.state.time += durationMin;
            Game.state.location = dest;

            if (method === 'metro') {
                Game.state.vitals.energy = Math.max(10, Game.state.vitals.energy - 8);
            }

            Engine3D.buildLocation(dest);
            this.updateHUD();
            this.closeModal();

            const locText = dest === 'office' ? 'офис компании' : 'квартиру';
            this.showToast('Перемещение завершено', `Вы прибыли в ${locText}.`);
        });
    },

    fadeTransition(callback) {
        const fade = document.getElementById('fade-screen');
        fade.classList.add('active');
        setTimeout(() => {
            callback();
            setTimeout(() => {
                fade.classList.remove('active');
            }, 300);
        }, 600);
    },

    openMeetingDialog() {
        if (!Game.state.career.isEmployed) {
            InterviewEngine.start();
            return;
        }

        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('dom-title').innerText = '👥 Daily Standup в переговорке "Байкал"';
        document.getElementById('dom-desc').innerText = 'Тимлид Артем: "Коллеги, начинаем синхронизацию. Кто что вчера сделал, какие планы на сегодня и есть ли блокеры?"';

        const opts = document.getElementById('dom-options');
        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.doStandupChoice(1)">
                <div class="action-opt-left">
                    <div class="action-opt-title">"Вчера локализовал утечку коннектов в connection pool, сегодня пишу фикс и тесты."</div>
                    <div class="action-opt-details">Репутация в команде: +5 • Профессиональный статус</div>
                </div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doStandupChoice(2)">
                <div class="action-opt-left">
                    <div class="action-opt-title">"Есть блокер: жду ответа от Дениса по упавшим интеграционным тестам."</div>
                    <div class="action-opt-details">Тимлид поможет оперативно решить блокер</div>
                </div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doStandupChoice(3)">
                <div class="action-opt-left">
                    <div class="action-opt-title">"Помогал стажеру настроить окружение Docker и поднять PostgreSQL."</div>
                    <div class="action-opt-details">Уважение коллег: +10</div>
                </div>
            </div>
        `;
    },

    doStandupChoice(choice) {
        AudioEngine.playSuccess();
        Game.state.career.reputation += choice === 3 ? 10 : 5;
        Game.state.time += 20;
        this.updateHUD();
        this.closeModal();
        this.showToast('Дейли завершен', 'Тимлид: "Отлично, зафиксировали. Всем хорошего продуктивного дня!"', 'success');
    },

    openCoffeeDialog() {
        const modal = document.getElementById('domestic-modal');
        document.getElementById('interactive-overlay').style.display = 'flex';
        document.getElementById('os-window').style.display = 'none';
        modal.style.display = 'flex';

        document.getElementById('dom-title').innerText = '☕ Офисный кофе-поинт';
        document.getElementById('dom-desc').innerText = 'Профессиональная кофемашина и кулер с водой. Место для отдыха и неформального общения с коллегами.';

        const opts = document.getElementById('dom-options');
        opts.innerHTML = `
            <div class="action-option-btn" onclick="GameApp.doOfficeCoffee('espresso')">
                <div class="action-opt-left">
                    <div class="action-opt-title">Сварить двойной Эспрессо</div>
                    <div class="action-opt-details">Энергия: +25% • Небольшой рост пульса/стресса (+5%)</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
            <div class="action-option-btn" onclick="GameApp.doOfficeCoffee('water')">
                <div class="action-opt-left">
                    <div class="action-opt-title">Попить прохладной воды и поболтать у кулера</div>
                    <div class="action-opt-details">Стресс: -15% • Здоровье: +5%</div>
                </div>
                <div class="action-opt-cost">Бесплатно</div>
            </div>
        `;
    },

    doOfficeCoffee(type) {
        AudioEngine.playKettle();
        if (type === 'espresso') {
            Game.state.vitals.energy = Math.min(100, Game.state.vitals.energy + 25);
            Game.state.vitals.stress = Math.min(100, Game.state.vitals.stress + 5);
            this.showToast('Кофе выпит', 'Энергия восстановлена, можно снова кодить!');
        } else {
            Game.state.vitals.stress = Math.max(0, Game.state.vitals.stress - 15);
            Game.state.vitals.health = Math.min(100, Game.state.vitals.health + 5);
            this.showToast('Отдых у кулера', 'Приятный смол-ток с коллегами разгрузил голову.');
        }
        this.updateHUD();
        this.closeModal();
    },

    payBill(type, amount) {
        if (Game.state.finances.rubles < amount) {
            alert('Недостаточно средств на банковском счете!');
            return;
        }
        AudioEngine.playSuccess();
        Game.state.finances.rubles -= amount;
        if (type === 'rent') Game.state.finances.rentPaid = true;
        if (type === 'utilities') Game.state.finances.utilitiesPaid = true;
        this.updateHUD();
        this.showToast('Счет оплачен', `С вашего счета списано ${amount.toLocaleString('ru-RU')} ₽.`, 'success');
    }
};

window.addEventListener('load', () => {
    GameApp.init();
});


// Explicitly expose on window for bulletproof inline HTML onclick handlers
if (typeof window !== 'undefined') {
    window.GameApp = GameApp;
    window.HiringEngine = HiringEngine;
    window.InterviewEngine = InterviewEngine;
    window.ServerTerminal = ServerTerminal;
    window.PlayerController = PlayerController;
    window.Engine3D = Engine3D;
    window.AudioEngine = AudioEngine;
    window.Game = Game;
}
