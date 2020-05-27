class utl {
    static get(selector) {
        return document.querySelector(selector);
    }
    static insertBefore(el, ref) {
        ref.parentElement.insertBefore(el, ref);
    }
    static remove(selector) {
        let el = utl.get(selector);
        if (el) {
            el.parentElement.removeChild(el);
        }
    }
    static setAttrs(el, attrs) {
        Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
    }
    static getStorageInt(name, min, max, defValue) {
        let rv = parseInt(localStorage.getItem(name), 10);
        if (isNaN(rv) || rv < min || rv > max) {
            rv = defValue;
        }
        return rv;
    }
    static getStorageObject(name, Default) {
        let st = localStorage.getItem(name);
        try {
            st = st && JSON.parse(st) || Default;
        } catch(e) {
            st = Default;    
        }
        return st;
    }
    static setStorageObject(name, value) {
        let s = JSON.stringify(value);
        localStorage.setItem(name, s);
    }
} //class utl

function functions_FormAccess() {
    const FormAccessIDs = {
        u: {
            "id": "userID",
            "type": "text",
            "placeholder": "Username",
            "autocomplete": "off"
        },
        p: {
            "id":  "passwordID",
            "type": "password",
            "placeholder": "Password",
            "autocomplete": "current-password"
        }
    };
    
    class FormAccess {
        static _createInput(isPassword) {
            var inp = document.createElement("input");
            utl.setAttrs(inp, isPassword ? FormAccessIDs.p : FormAccessIDs.u);
    
            inp.value = isPassword ? "Password12" : "Username12";
            inp.classList.add("tm-input");
            return inp;
        }
        static addUser() {
            const user = FormAccess._createInput(false);
            user.value = gAppData.textUser;
            user.addEventListener('input', () => { gAppData.textUser = user.value; saveAppData() });

            const pass = FormAccess.getPass();
            const elBtn = utl.get("form > input[type='submit']");
            utl.insertBefore(user, pass || elBtn);
        }
        static addPass() {
            const pass = FormAccess._createInput(true);
            pass.value = gAppData.textPass;
            pass.addEventListener('input', () => { gAppData.textPass = pass.value; saveAppData() });

            const elBtn = utl.get("form > input[type='submit']");
            utl.insertBefore(pass, elBtn);
        }
        static removeUser() {
            utl.remove(`#${FormAccessIDs.u.id}`);
        }
        static removePass() {
            utl.remove(`#${FormAccessIDs.p.id}`);
        }
        static getUser() {
            return utl.get(`#${FormAccessIDs.u.id}`);
        }
        static getPass() {
            return utl.get(`#${FormAccessIDs.p.id}`);
        }
        static focusUser() {
            setTimeout(() => {
                const user = utl.get(`#${FormAccessIDs.u.id}`);
                user && user.focus();
                console.log(`activeU: `, document.activeElement);
            }, 100);
        }
        static focusPass() {
            setTimeout(() => {
                const pass =  utl.get(`#${FormAccessIDs.p.id}`);
                pass && pass.focus();
                console.log(`activeP: `, document.activeElement);
            }, 100);
        }
        static stage0(event) {
            event.preventDefault();
    
            let u = FormAccess.getUser();
            if (!u) {
                FormAccess.addUser();
            }
    
            let p = FormAccess.getPass();
            if (!p) {
                FormAccess.addPass();
            }
    
            FormAccess.focusUser();
            console.log(`active-stage0: `, document.activeElement);
        }
        static stage1(event) {
            event.preventDefault();
    
            let u = FormAccess.getUser();
            if (!u) {
                FormAccess.addUser();
            }
    
            let p = FormAccess.getPass();
            if (p) {
                FormAccess.removePass();
            }
    
            FormAccess.focusUser();
            console.log(`active-stage1: `, document.activeElement);
        }
        static stage2(event) {
            event.preventDefault();
    
            let u = FormAccess.getUser();
            if (u) {
                FormAccess.removeUser();
            }
    
            let p = FormAccess.getPass();
            if (!p) {
                FormAccess.addPass();
            }
    
            FormAccess.focusPass();
            console.log(`active-stage2: `, document.activeElement);
        }
        static onSubmit(event) {
            let u = FormAccess.getUser();
            let p = FormAccess.getPass();
    
            let isStage1 = !!u && !p;
            let frmSubmit = utl.get('#formlogin');
    
            if (isStage1) {
                event.preventDefault();
                FormAccess.stage2(event);
            }
        }
        static onReload(event) {
            (event.preventDefault(), history.go(0)); // Calling go() without parameters or a value of 0 reloads the current page.                    
        }
        static onInitialLoad() {
            utl.get('#formlogin input[type="submit"]').addEventListener('click', FormAccess.onSubmit, false);
            utl.get("#btnStage0").addEventListener("click", FormAccess.stage0, false);
            utl.get("#btnStage1").addEventListener("click", FormAccess.stage1, false);
            utl.get("#btnStage2").addEventListener("click", FormAccess.stage2, false);
            utl.get("#btnReload").addEventListener("click", FormAccess.onReload, false);
        }
    } //class FormAccess

    function functions_SetFormStateOnLoaded(delayed_, delay_) {
        let elmChkDelay = utl.get('#btnDelay input[type="checkbox"]');
        let elmDelay = utl.get("#inpDelay");
    
        if (delayed_) {
            FormAccess.removeUser();
            FormAccess.removePass();
    
            //elmChkDelay.classList.add("hidden-now");
            elmChkDelay.disabled = true;
            elmDelay.disabled = true;
    
            setTimeout(() => {
                FormAccess.addUser();
                FormAccess.addPass();
                FormAccess.focusUser();
    
                //elmChkDelay.classList.remove("hidden-now");
                elmChkDelay.disabled = false;
                elmDelay.disabled = false;
                utl.get(".spinner").classList.add("display-none");
            }, delay_);
    
        } else {
            utl.get(".spinner").classList.add("display-none");
            FormAccess.addUser();
            FormAccess.addPass();
            FormAccess.focusUser();
        }
    } //functions_SetFormStateOnLoaded()
        
    FormAccess.onInitialLoad();
    functions_SetFormStateOnLoaded(gAppData.delayed, gAppData.delay);
} //functions_FormAccess()

function functions_LoadDelay() {
    // 3.1 Delayed button get from storage
    let elChkDelay = utl.get('#btnDelay input[type="checkbox"]');
    let elDelay = utl.get("#inpDelay");
    // 3.2 Delayed button apply
    elDelay.value = gAppData.delay;
    if (gAppData.delayed) {
        elChkDelay.checked = true;
    }
    elDelay.disabled = !gAppData.delayed;
    // 3.3 Delayed button listen for changes
    utl.get("#btnDelay").addEventListener("click", function onBtnDelay(event) {
        gAppData.delayed = elChkDelay.checked;
        elDelay.disabled = !gAppData.delayed;
        saveAppData();
    }, false);
    elDelay.addEventListener("input", event => (gAppData.delay = +elDelay.value, saveAppData()), false);
} //functions_LoadDelay()

function functions_Timer() {
    // TODO: These controls have different class name. We can make the same, but need to check CSS. later.
    // let fakesCounter = document.querySelector('#fakes-counter');
    // function updateCounter() {
    //     let cnt = document.querySelectorAll('div[data-number]').length;
    //     fakesCounter.innerText = cnt;
    // }

    // 4.1 Timer button get from storage
    let elChkTimer = utl.get('#btnTimer input[type="checkbox"]');
    let elTimer = utl.get("#inpTimer");

    // 4.2 Timer button apply
    elTimer.value = gAppData.timer;
    if (gAppData.dotimer) {
        elChkTimer.checked = true;
    }
    elTimer.disabled = !gAppData.dotimer;

    // 4.3 Timer button listen for changes
    utl.get("#btnTimer").addEventListener("click", function onBtnTimer(event) {
        gAppData.dotimer = elChkTimer.checked;
        elTimer.disabled = !gAppData.dotimer;
        saveAppData();
        runTimer(gAppData.dotimer);
    }, false);
    elTimer.addEventListener("input", event => {
        gAppData.timer = +elTimer.value;
        saveAppData();
        runTimer(gAppData.dotimer);
    }, false);

    // 4.4 Timer
    let intervalID = null;
    function runTimer(runOrStop) {
        if (runOrStop) {
            if (intervalID !== null) {
                clearInterval(intervalID);
            }
            intervalID = setInterval(onInterval, gAppData.timer);
        }
        else {
            if (intervalID !== null) {
                clearInterval(intervalID);
                intervalID = null;
            }
        }
    }

    function onInterval() {
        //console.log(new Date());
        triggerChanges();
    }

    let fakesID = 100;
    function triggerChanges() {
        // 1.
        let before = document.createElement("div");
        utl.setAttrs(before, {
            "class": "fake-before",
            "data-removable": `${fakesID}`,
        });
        // 2.
        let inp = document.createElement("input");
        utl.setAttrs(inp, {
            "id": `${fakesID}`,
            "type": "password",
            "class": "tm-input",
            "placeholder": "fakePass"
        });
        inp.value = "fake value";
        // 3.
        let close = document.createElement("div");
        utl.setAttrs(close, {
            "class": "fake__close",
        });
        close.innerText = '\u00D7'; //\u274C
        close.addEventListener('click', function () {
            this.parentElement.parentElement.removeChild(this.parentElement); // .fake
        });
        let parent = utl.get('.fakes');
        before.appendChild(inp);
        before.appendChild(close);
        parent.insertBefore(before, parent.firstElementChild);
        //parent.removeChild(inp); //TODO: We cannot hide icon if comment this.
        fakesID++;
    } //triggerChanges()

    //triggerChanges();
    runTimer(gAppData.dotimer);
} //functions_Timer()

function functions_CreateBlock() {
    let lastIndex = 0;

    let fakesCounter = document.querySelector('#fakes-counter');
    function updateCounter() {
        let cnt = document.querySelectorAll('div[data-number]').length;
        fakesCounter.innerText = cnt;
    }

    function zeros(n) {
        let s = '' + n;
        return s.length > 1 ? s : '0' + s;
    }

    function lines(totalUser, totalPsw) {
        //<!-- (div[data-number=0$]>input)*3 -->
        let s = '';
        for (let index = 0; index < totalUser; index++) {
            ++lastIndex;
            s += `<div data-number="${zeros(lastIndex)}"><input type="text" id="fake-user-${zeros(lastIndex)}" class="fake-user" autocomplete="off"></div>`;
        }
        for (let index = 0; index < totalPsw; index++) {
            ++lastIndex;
            s += `<div data-number="${zeros(lastIndex)}"><input type="password" id="fake-pass-${zeros(lastIndex)}" class="fake-pass" autocomplete="off"></div>`;
        }
        return s;
    }

    const addRemoveChild = (e) => {
        e.currentTarget.parentElement.removeChild(e.currentTarget);
        lastIndex--;
        updateCounter();
    };

    utl.get('#btnBlock').addEventListener('click', function onBtnBlock() {
        let newBlock = document.createElement('div');
        newBlock.innerHTML = `
        <div class="bulk-form-wrap">
            <div class="bulk-form-controls">
                <button class="bulk-del">-</button>
                <button class="bulk-add-user">+U</button>
                <button class="bulk-add-pass">+P</button>
                <button class="bulk-remove">&#x00d7;</button>
            </div>
            <form action="#" class="bulk-form">
                ${lines(11, 1)}
            </form>
        </div>
        `;

        let children = [...newBlock.querySelectorAll('.bulk-form > *')];
        children.forEach((child) => child.addEventListener('click', addRemoveChild, false));

        newBlock.querySelector('.bulk-del').addEventListener('click', function onBtnBulkDel() {
            let form = newBlock.querySelector('form');
            if (form.children.length) {
                form.removeChild(form.lastElementChild);
                lastIndex--;
                updateCounter();
            }
        }, false);

        function addChild(userORpass) {
            let form = newBlock.querySelector('form');
            let elm = document.createElement('div');
            elm.innerHTML = lines(userORpass ? 1 : 0, userORpass ? 0 : 1);
            let children = [...elm.children];
            children.forEach((child) => child.addEventListener('click', addRemoveChild, false));
            children.forEach(child => form.appendChild(child, form.lastElementChild));
            updateCounter();
        }

        newBlock.querySelector('.bulk-add-user').addEventListener('click', () => addChild(true), false);
        newBlock.querySelector('.bulk-add-pass').addEventListener('click', () => addChild(false),  false); // we can add paterns as well: u+p or u+p+p

        newBlock.querySelector('.bulk-remove').addEventListener('click', function onBtnBulkRemove() {
            let form = newBlock.querySelector('form');
            let n = form.elements.length;
            lastIndex -= n;
            newBlock.parentElement.removeChild(newBlock);
            updateCounter();
        }, false);

        let place = utl.get('#formlogin');
        place.parentElement.insertBefore(newBlock, place.nextElementSibling);
        updateCounter();
    }, false);
} //functions_CreateBlock()

var gAppData = {
    delayed: false,
    delay: 500,

    dotimer: false,
    timer: 500,

    textUser: '',
    textPass: '',
};

function loadAppData() {
    gAppData = utl.getStorageObject('testcase012-dyna', gAppData);
} //loadAppData()

function saveAppData() {
    utl.setStorageObject('testcase012-dyna', gAppData);
} //saveAppData()

function main() {
    loadAppData();
    functions_FormAccess();
    functions_LoadDelay();
    functions_Timer();
    functions_CreateBlock();
} //main()

document.addEventListener("DOMContentLoaded", main, false);
