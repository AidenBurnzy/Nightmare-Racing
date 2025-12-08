(function () {
    const serviceData = {
        title: 'Wiring & Electrical Repair',
        tagline: 'Diagnostics-driven electrical repair for CAN bus, standalone ECUs, motorsport harnesses, and street-driven builds alike.',
        visual: 'We scope every circuit, validate loads, and document repairs so gremlins stay gone. From parasitic draws to custom sensor looms, the fix is clean, labeled, and ready for future upgrades.',
        meta: ['CAN & LIN Diagnostics', 'Standalone ECU Integration', 'Motorsport Harness Fab'],
        sections: [
            {
                heading: 'Troubleshooting you can trust',
                type: 'list',
                items: [
                    'Factory scan tools and PicoScope validation for modern CAN/LIN platforms',
                    'Pin-by-pin continuity checks and voltage drop analysis to isolate intermittent faults',
                    'Harness reshaping, re-looming, and Deutsch/Autosport connector repairs',
                    'Documentation package with diagrams, resistance values, and repair notes'
                ]
            },
            {
                heading: 'Common issues we resolve',
                type: 'list',
                items: [
                    'Standalone ECU conversions, sensor calibrations, and auxiliary I/O mapping',
                    'Fuel pump, fan, and auxiliary system relays with upgraded wiring protection',
                    'Track-car data acquisition, PDM integration, and fail-safe routing',
                    'Battery relocation, kill switch installation, and high-current cable fabrication'
                ]
            },
            {
                heading: 'Why NMR Automotive',
                type: 'paragraph',
                body: 'Electrical failures derail builds. Our team blends OEM-level diagnostic discipline with motorsport fabrication standards so your wiring stays transparent, serviceable, and future-proof as you keep evolving the car.'
            }
        ],
        cta: {
            title: 'Chasing an electrical ghost?',
            description: 'Bring your diagnostic logs or symptoms and we will map out a repair strategy that restores confidence in every circuit.',
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
            setText('cta-title', data.cta?.title || 'Connect with our technicians');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Let’s map out the electrical solution your build deserves.');
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
