(function () {
    const serviceData = {
        title: 'Check Engine Light Repairs',
        tagline: 'Accurate diagnostics to find and fix the real problem.',
        visual: 'That check engine light means something is wrong. We use professional-grade diagnostic equipment to identify the exact cause and provide reliable repairs to get your light off and keep it off.',
        meta: ['OBD-II Diagnostics', 'Emissions Testing', 'Sensor Replacement'],
        sections: [
            {
                heading: 'Diagnostic Services',
                type: 'list',
                items: [
                    'Complete OBD-II scan with freeze frame data analysis',
                    'Live data monitoring and component testing',
                    'Oxygen sensor testing and replacement',
                    'Mass airflow sensor and throttle body service',
                    'Catalytic converter diagnostics and replacement',
                    'EVAP system leak detection and repair'
                ]
            },
            {
                heading: 'Common Causes We Fix',
                type: 'list',
                items: [
                    'Faulty oxygen sensors and air-fuel ratio sensors',
                    'Failed catalytic converters and exhaust leaks',
                    'Mass airflow sensor and MAP sensor issues',
                    'Ignition system problems - coils, plugs, and wires',
                    'EVAP system leaks from gas cap to purge valve',
                    'Emissions control components and EGR valves'
                ]
            },
            {
                heading: 'Get It Fixed Right',
                type: 'paragraph',
                body: 'Don\'t ignore that check engine light. Small problems can become major repairs if left unaddressed. We provide accurate diagnosis, explain what\'s wrong in plain language, and fix it right the first time with quality parts and expert service.'
            }
        ],
        cta: {
            title: 'Check Engine Light On?',
            description: 'Stop guessing. Get a professional diagnostic today and know exactly what\'s wrong with your vehicle.',
            actions: [
                { label: 'Book Diagnostic Service', href: '../src/pages/request-quote.html', className: 'primary' }
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
