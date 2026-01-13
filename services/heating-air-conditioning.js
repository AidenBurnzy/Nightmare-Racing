(function () {
    const serviceData = {
        title: 'Heating and Air Conditioning Repair',
        tagline: 'Stay comfortable in any weather with professional climate control service.',
        visual: 'Your vehicle\'s HVAC system keeps you comfortable year-round. We diagnose and repair heating, cooling, and ventilation issues using specialized equipment and EPA-certified techniques.',
        meta: ['A/C Recharge', 'Heater Core Repair', 'Climate Control'],
        sections: [
            {
                heading: 'HVAC Services',
                type: 'list',
                items: [
                    'Air conditioning performance testing and refrigerant recharge',
                    'A/C compressor, condenser, and evaporator replacement',
                    'Heater core repair and coolant system service',
                    'Blend door actuator and climate control module diagnostics',
                    'Cabin air filter replacement for improved air quality',
                    'A/C system leak detection and repair using UV dye technology'
                ]
            },
            {
                heading: 'Complete Climate Solutions',
                type: 'list',
                items: [
                    'EPA-certified refrigerant recovery and recycling',
                    'Electronic climate control diagnostics and programming',
                    'Vent and ductwork inspection and cleaning',
                    'Blower motor and resistor replacement',
                    'Defroster repair for clear visibility',
                    'Performance upgrades for enhanced cooling capacity'
                ]
            },
            {
                heading: 'Comfort Matters',
                type: 'paragraph',
                body: 'A properly functioning HVAC system is essential for comfort and safety. Whether you need ice-cold air conditioning for summer or reliable heat for winter, our certified technicians have the expertise and equipment to restore your climate control system.'
            }
        ],
        cta: {
            title: 'AC Not Blowing Cold?',
            description: 'Don\'t suffer through another hot day. We\'ll diagnose your HVAC system and get you back to comfort quickly.',
            actions: [
                { label: 'Schedule HVAC Service', href: '../src/pages/request-quote.html', className: 'primary' }
            ]
        }
    };

    const renderServicePage = (data) => {
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el && typeof value === 'string') {
                el.textContent = value;
            }
        };

        document.title = `${data.title} | NMR Automotive`;
        setText('service-title', data.title);
        setText('service-tagline', data.tagline);
        setText('service-visual', data.visual);

        const metaContainer = document.getElementById('service-meta');
        if (metaContainer) {
            metaContainer.innerHTML = '';
            (data.meta || []).forEach((chipText) => {
                const chip = document.createElement('span');
                chip.textContent = chipText;
                metaContainer.appendChild(chip);
            });
        }

        const detailsContainer = document.getElementById('service-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = '';
            (data.sections || []).forEach((section) => {
                const card = document.createElement('article');
                card.className = 'details-card';

                const heading = document.createElement('h3');
                heading.textContent = section.heading;
                card.appendChild(heading);

                if (section.type === 'list') {
                    const list = document.createElement('ul');
                    (section.items || []).forEach((item) => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        list.appendChild(li);
                    });
                    card.appendChild(list);
                } else if (section.type === 'paragraph') {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = section.body;
                    card.appendChild(paragraph);
                }

                detailsContainer.appendChild(card);
            });
        }

        if (document.getElementById('cta-title')) {
            setText('cta-title', data.cta?.title || 'Ready to upgrade?');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Contact us today to discuss your needs.');
        }

        const ctaActions = document.getElementById('cta-actions');
        if (ctaActions) {
            ctaActions.innerHTML = '';
            (data.cta?.actions || []).forEach((action) => {
                const link = document.createElement('a');
                link.textContent = action.label;
                link.href = action.href;
                if (action.className) {
                    link.classList.add(action.className);
                }
                ctaActions.appendChild(link);
            });
        }

        const yearEl = document.getElementById('service-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear().toString();
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        renderServicePage(serviceData);
    });
})();
