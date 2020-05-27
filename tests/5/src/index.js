Vue.component('child', {
    template: `
        <div>
            <button v-on:click="emit">Clique me to emit from child component</button>
        </div>
    `,
    methods: {
        emit: function() {
            this.$emit('event_child', 1);
        }
    }
});

const formsData = {
    formA: {
        label: 'Change: New+New',
        fields: [
            {
                type: 'password',
                placeholder: "Password New",
                'data-ftype': 1 // new
            },
            {
                type: 'password',
                placeholder: "Password Confirm",
                'data-ftype': 1 // new
            },
        ]
    },
    formB: {
        label: 'Change: Cur+New',
        fields: [
            {
                type: 'password',
                placeholder: "Password Current",
                name: 'current-password',
                'data-ftype': 0 // old
            },
            {
                type: 'password',
                placeholder: "Password New",
                'data-ftype': 1 // new
            },
        ]
    },
    formC: {
        label: 'Change Cur+New+New',
        fields: [
            {
                type: 'password',
                placeholder: "Password Current",
                'data-ftype': 0 // old
            },
            {
                type: 'password',
                placeholder: "Password New",
                'data-ftype': 1 // new
            },
            {
                type: 'password',
                placeholder: "Password Confirm",
                'data-ftype': 1 // new
            },
        ]
    },
};

function setAttrs(el, attrs) {
    Object.keys(attrs).forEach(_ => el.setAttribute(_, attrs[_]));
}

Vue.component('test-form', {
    template: '#test-template',
    data: function() {
        return {
            formId: '',
            formLabel: '',

            opt_hasUsername: false,
            opt_hasLogin: false,
            opt_fillInvalid: true,

            fillin: [] // fill-values: 0 - old; 1 - new
        };
    },
    mounted() {
        this.formId = this.$el.dataset['formId'];
        
        let form = formsData[this.formId];
        this.formLabel = form.label;
        form.fields.forEach(_ => this.addField(_));

        this.fillin = form.fields.map(_ => _['data-ftype']);
    },
    watch: {
        opt_hasUsername: function(value) {
            this.addUsername(value);
        }
    },
    methods: {
        addUsername(add) {
            let formEl = this.$el.querySelector('.form-username');
            let usernameEl = formEl.querySelector('.username');
            if (add) {
                if (!usernameEl) {
                    let el = document.createElement('input');
                    setAttrs(el, {
                        type: 'text',
                        'class': 'username',
                        placeholder: 'User name',
                        value: 'maxzz'

                    });
                    formEl.insertBefore(el, formEl.firstElementChild);
                }
            } else {
                if (usernameEl) {
                    formEl.removeChild(usernameEl);
                }
            }
        },
        addField(attrs) {
            let formEl = this.$el.querySelector('.form-fields');
            let all = [...formEl.querySelectorAll('input:not([type=checkbox])')];
            let last = all[all.length - 1] ? all[all.length - 1].nextElementSibling : formEl.firstElementChild;

            let el = document.createElement('input');
            setAttrs(el, attrs);
            formEl.insertBefore(el, last);
        },
        fillValues() {
            let all = [...this.$el.querySelectorAll('.form-fields input')];
            all.forEach((_, index) => {
                _.value = `____ ${this.fillin[index]} ____`;
            });
        },
        clearValues() {
            let all = [...this.$el.querySelectorAll('.form-fields input')];
            all.forEach(_ => {
                _.value = '';
            });
        },
    },
});

var vm = new Vue({
    el: '#app',
    created() {
        this.$on('event_parent', function(id) {
            console.log('Event from parent component emitted', id);
        });
    },
    data: function() {
        return {
            msg: 'hello vue',
            id: ''
        };
    },
    methods: {
        eventChild: function(id) {
            console.log('Event from child component emitted', id);
        },
        eventParent: function() {
            this.$emit('event_parent', 1);
        }
    }
});
