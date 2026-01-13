(function () {
    const serviceData = {
        title: 'Engine Repair and Replacement',
        tagline: 'Expert engine service from minor repairs to complete rebuilds.',
        visual: 'Your engine is the heart of your vehicle. We provide comprehensive engine repair, rebuild, and replacement services using advanced diagnostics and precision workmanship.',
        meta: ['Engine Diagnostics', 'Complete Rebuilds', 'Engine Swaps'],
        sections: [
            {
                heading: 'Engine Services',
                type: 'list',
                items: [
                    'Complete engine diagnostics with state-of-the-art scan tools',
                    'Timing belt and chain replacement with water pump service',
                    'Head gasket repair and cylinder head machining',
                    'Engine rebuild with precision bore and hone work',
                    'Remanufactured and used engine replacement',
                    'Performance engine builds and modifications'
                ]
            },
            {
                heading: 'Our Process',
                type: 'list',
                items: [
                    'Comprehensive inspection and diagnostic testing',
                    'Detailed estimate with options and recommendations',
                    'Quality parts from trusted suppliers with warranties',
                    'Precision assembly following manufacturer specifications',
                    'Thorough break-in procedures and post-repair testing',
                    'Extended warranty options available on major repairs'
                ]
            },
            {
                heading: 'Built Right',
                type: 'paragraph',
                body: 'Engine work requires expertise and precision. Our ASE-certified technicians have decades of combined experience with all makes and models. Whether you need a simple repair or a complete rebuild, we deliver quality work backed by our guarantee.'
            }
        ],
        cta: {
            title: 'Engine Problems?',
            description: 'Don\'t let engine issues leave you stranded. Get a professional diagnosis and honest recommendations.',
            actions: [
                { label: 'Schedule Engine Diagnostics', href: '../src/pages/request-quote.html', className: 'primary' }
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
