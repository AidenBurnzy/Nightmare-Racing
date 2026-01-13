(function () {
    const serviceData = {
        title: 'Tire Repair and Replacement',
        tagline: 'Get back on the road safely with expert tire service.',
        visual: 'Quality tires are your connection to the road. We offer professional tire repair, replacement, and alignment services using industry-leading equipment and techniques.',
        meta: ['Tire Installation', 'Wheel Alignment', 'TPMS Service'],
        sections: [
            {
                heading: 'Tire Services',
                type: 'list',
                items: [
                    'New tire sales from top brands - performance, all-season, and winter options',
                    'Professional tire mounting and computer wheel balancing',
                    'Tire rotation and tread depth inspection',
                    'Flat tire repair and patch service for repairable punctures',
                    'TPMS sensor service, programming, and replacement',
                    'Nitrogen tire inflation for improved pressure retention'
                ]
            },
            {
                heading: 'Wheel Alignment & Balancing',
                type: 'list',
                items: [
                    'Precision computerized wheel alignment - 2-wheel and 4-wheel',
                    'Camber, caster, and toe adjustments to factory specifications',
                    'Dynamic wheel balancing to eliminate vibrations',
                    'Performance alignment setups for track and spirited driving',
                    'Alignment checks included with suspension work',
                    'Detailed before and after alignment reports'
                ]
            },
            {
                heading: 'Your Safety First',
                type: 'paragraph',
                body: 'Worn or damaged tires compromise your safety and vehicle performance. Our tire experts will help you choose the right tires for your driving needs and ensure they\'re properly installed, balanced, and aligned for optimal safety and tire life.'
            }
        ],
        cta: {
            title: 'Need New Tires?',
            description: 'Let us help you find the perfect tires for your vehicle and driving style. Competitive pricing on all major brands.',
            actions: [
                { label: 'Get a Tire Quote', href: '../src/pages/request-quote.html', className: 'primary' }
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
