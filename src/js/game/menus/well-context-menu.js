const { createElement } = require('../../lib/helpers');

class WellContextMenu {
    constructor (parent_gravity_well, mouse) {
        this.parent_gravity_well = parent_gravity_well;

        this.mouse_over = true;
        this.radius_max = 1000;
        this.force_max = 250;

        this.node = null;
        this.createCreateContextNode();
        this.positionMenu(mouse);

        setTimeout(() => {
            this.id_base = 'well_context';
            [
                'radius_input',
                'radius_value',
                'force_input',
                'force_value',
                'direction',
                'delete'
            ].forEach((node_id) => {
                this[`el_${this.id_base}_${node_id}`] = document.getElementById(`${this.id_base}_${node_id}`);
            });
            this.setEvents();
        }, 0);
    }

    nodeTemplate () {
        console.log(this.parent_gravity_well);
        return `
            <div>
                <span>Radius: </span><span id="well_context_radius_value">${this.parent_gravity_well.radius}</span>
                <div id="radius-input">
                    <span>1</span>
                    <input id="well_context_radius_input" type="range" min="1" max="${this.radius_max}" step="1" value="${this.parent_gravity_well.radius}">
                    <span>${this.radius_max}</span>
                </div>
            </div>
            <div>
                <span>Force: </span><span id="well_context_force_value">${this.parent_gravity_well.force}</span>
                <div id="force-input">
                    <span>1</span>
                    <input id="well_context_force_input" type="range" min="1" max="${this.force_max}" step="1" value="${this.parent_gravity_well.force}">
                    <span>${this.force_max}</span>
                </div>
            </div>
            <div>
                <label for="well_context_direction">Invert Force (push)?</label>
                <input id="well_context_direction" type="checkbox" ${this.parent_gravity_well.forceDirection === 1 ? '' : 'checked'}/>
            </div>
            <button id="well_context_delete">Delete</button>
        `;
    }

    createCreateContextNode () {
        this.node = createElement('div', 'well_context menu', {
            addTo: document.body,
            html: this.nodeTemplate()
        });
    }

    positionMenu (mouse) {
        const canvas_height = this.parent_gravity_well.layer.canvas.height;
        if (mouse.y > (canvas_height / 2)) {
            this.node.style.top = 'auto';
            this.node.style.bottom = canvas_height - mouse.y - 5 + 'px';
        } else {
            this.node.style.bottom = 'auto';
            this.node.style.top = mouse.y - 5 + 'px';
        }
        this.node.style.left = mouse.x - 5 + 'px';
    }

    setEvents () {
        this.node.addEventListener('mousehover', (e) => {
            this.mouse_over = true;
        });
        this.node.addEventListener('mouseleave', (e) => {
            this.mouse_over = false;
        });

        this.el_well_context_radius_input.addEventListener('change', (e) => {
            const val = parseInt(e.currentTarget.value, 10);
            this.el_well_context_radius_value.innerHTML = val;
            this.parent_gravity_well.radius = val;
            this.parent_gravity_well.layer.update = true;
        });

        this.el_well_context_force_input.addEventListener('change', (e) => {
            const val = parseInt(e.currentTarget.value, 10);
            this.el_well_context_force_value.innerHTML = val;
            this.parent_gravity_well.force = val;
        });

        this.el_well_context_delete.addEventListener('click', (e) => {
            this.parent_gravity_well.layer.update = true;
            this.parent_gravity_well.shutdown();
            this.node.remove();
        });

        this.el_well_context_direction.addEventListener('click', (e) => {
            if (e.currentTarget.checked) {
                this.parent_gravity_well.forceDirection = -1;
            } else {
                this.parent_gravity_well.forceDirection = 1;
            }
        });
    }

    remove () {
        this.node.remove();
    }
}

module.exports = WellContextMenu;
