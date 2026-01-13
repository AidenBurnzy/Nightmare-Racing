(function () {
    const serviceData = {
        title: 'Suspension Repair and Upgrades',
        tagline: 'Precision handling and comfort through expert suspension service.',
        visual: 'Your suspension system directly impacts ride quality, handling, and safety. From worn shocks to complete performance builds, we deliver suspension solutions tailored to your driving needs.',
        meta: ['Shock & Strut Replacement', 'Coilover Installation', 'Alignment Service'],
        sections: [
            {
                heading: 'Suspension Services',
                type: 'list',
                items: [
                    'Shock absorber and strut replacement with quality components',
                    'Coilover suspension installation and corner balancing',
                    'Control arm, ball joint, and bushing replacement',
                    'Sway bar upgrades and end link service',
                    'Air suspension diagnostics and repair',
                    'Lift kit and lowering kit installation with alignment'
                ]
            },
            {
                heading: 'Performance Tuning',
                type: 'list',
                items: [
                    'Custom suspension setups for street, track, or off-road use',
                    'Spring rate selection and damper tuning for your application',
                    'Corner weighting and ride height optimization',
                    'Adjustable suspension setup and baseline tuning',
                    'Alignment specs customized for performance or comfort',
                    'Comprehensive test drive and feedback session'
                ]
            },
            {
                heading: 'Transform Your Ride',
                type: 'paragraph',
                body: 'Whether you need to restore factory ride quality or build a competition-ready suspension, our technicians have the knowledge and tools to deliver. We combine quality parts with precise installation and setup for exceptional results.'
            }
        ],
        cta: {
            title: 'Rough Ride or Poor Handling?',
            description: 'Let us inspect your suspension and recommend the right solution. From simple repairs to complete overhauls, we\'ve got you covered.',
            actions: [
                { label: 'Schedule Suspension Service', href: '../src/pages/request-quote.html', className: 'primary' }
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
