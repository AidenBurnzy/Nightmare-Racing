(function () {
    const serviceData = {
        title: 'Engine Swaps',
        tagline: 'Turn-key engine swap programs with mounts, wiring, fueling, and calibration support engineered for factory-level reliability.',
        visual: 'We blueprint swap plans before a wrench turns—mockups, wiring schematics, power steering and AC routing, exhaust clearance, and driveline math—so the completed swap drives like it rolled off the assembly line.',
        meta: ['Turn-Key Solutions', 'Wiring Integration', 'Compliance & Safety'],
        sections: [
            {
                heading: 'What’s included',
                type: 'list',
                items: [
                    'Project planning covering packaging, weight distribution, and compliance requirements',
                    'Fabricated mounts, crossmembers, and drivetrain adapters with serviceable hardware',
                    'Standalone or OEM ECU integration, PDM solutions, and fully labeled harnesses',
                    'Cooling, fueling, exhaust, and driveline upgrades matched to power goals'
                ]
            },
            {
                heading: 'Swap experience',
                type: 'list',
                items: [
                    'JZ, LS, Coyote, K-series, and modern turbo four-cylinder conversions',
                    'Import chassis modernization, including safety systems and CAN integration',
                    'Race car powerplant refreshes between seasons to keep programs on schedule',
                    'Street-legality strategies including emissions equipment where required'
                ]
            },
            {
                heading: 'Committed deliverables',
                type: 'paragraph',
                body: 'Every swap ships with a build book: wiring diagrams, parts lists, torque specs, calibration data, and maintenance notes. If future changes are needed, you or another shop can service the swap with confidence.'
            }
        ],
        cta: {
            title: 'Swap vision ready to execute?',
            description: 'Share your chassis, desired powerplant, and driving goals. We will map the parts, timeline, and investment required to make it happen.',
            actions: [
                { label: 'Book A Consultation', href: '../src/pages/request-quote.html', className: 'primary' },
                { label: 'Email Build Sheet', href: 'mailto:nightmareracing1@gmail.com', className: 'secondary' }
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

        document.title = `${data.title} | Nightmare Racing`;
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
            setText('cta-title', data.cta?.title || 'Let’s build together');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Tell us about your ideal swap and we will get started.');
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
