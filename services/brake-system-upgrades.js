(function () {
    const serviceData = {
        title: 'Brake System Upgrades',
        tagline: 'Confidence-inspiring brake packages tuned for street, track, or competition use with repeatable pedal feel.',
        visual: 'From multi-piston big brake kits to motorsport pad compounds, we balance braking force, heat management, and pedal modulation so you can stay deep on the brakes without fade.',
        meta: ['Big Brake Packages', 'Track Pad Setup', 'Thermal Management'],
        sections: [
            {
                heading: 'Upgrade options',
                type: 'list',
                items: [
                    'Big brake kits with balanced piston sizing and stainless lines',
                    'Motorsport pad and rotor pairing tailored to vehicle weight and tire grip',
                    'Brake fluid upgrades, bleeding, and ABS recalibration for high-heat use',
                    'Ducting, master cylinder, and pedal box modifications for competition'
                ]
            },
            {
                heading: 'How we tune braking',
                type: 'list',
                items: [
                    'Baseline evaluation including pedal travel, bias, and heat signatures',
                    'Compound testing to match tires, track temp, and endurance targets',
                    'Post-install bedding procedure with temperature paint and telemetry review',
                    'Maintenance schedule and pad/rotor wear logs for future events'
                ]
            },
            {
                heading: 'Delivering control',
                type: 'paragraph',
                body: 'Brakes should inspire confidence lap after lap. Our packages combine parts, fluid, and setup with the documentation you need to keep the system at peak performance.'
            }
        ],
        cta: {
            title: 'Need more stopping power?',
            description: 'Tell us how and where you drive. We will build a brake plan that balances stopping power, heat capacity, and budget.',
            actions: [
                { label: 'Contact us about your build', href: '../src/pages/contact.html', className: 'primary' }
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
            setText('cta-title', data.cta?.title || 'Upgrade your brakes');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Let’s build the braking system your driving demands.');
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
