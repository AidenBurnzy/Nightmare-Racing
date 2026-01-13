(function () {
    const serviceData = {
        title: 'Oil Change, Fluid and Filter Services',
        tagline: 'Keep your engine running smooth with regular maintenance.',
        visual: 'Proper fluid maintenance is essential for longevity and performance. We use premium oils and filters, performing thorough multi-point inspections with every service.',
        meta: ['Synthetic Oil Changes', 'Transmission Service', 'Complete Fluid Flush'],
        sections: [
            {
                heading: 'Fluid Services We Offer',
                type: 'list',
                items: [
                    'Full synthetic, synthetic blend, and conventional oil changes',
                    'Transmission fluid exchange and filter replacement',
                    'Coolant flush and radiator service',
                    'Differential and transfer case fluid service',
                    'Power steering fluid flush and brake fluid exchange',
                    'Fuel system cleaning and filter replacement'
                ]
            },
            {
                heading: 'What\'s Included',
                type: 'list',
                items: [
                    'Premium oil and OEM-spec filters for your specific vehicle',
                    'Multi-point inspection including tire pressure and brake check',
                    'Fluid level top-off for all accessible systems',
                    'Maintenance reminder sticker and digital service records',
                    'Complimentary vehicle wash with every service',
                    'Expert recommendations for upcoming maintenance needs'
                ]
            },
            {
                heading: 'Maintenance Made Easy',
                type: 'paragraph',
                body: 'Regular fluid maintenance prevents costly repairs down the road. Our technicians follow manufacturer specifications and use quality products to keep your vehicle running at its best. We\'ll help you stay on schedule with personalized service intervals.'
            }
        ],
        cta: {
            title: 'Time for an Oil Change?',
            description: 'Schedule your service today. Quick, convenient, and done right the first time.',
            actions: [
                { label: 'Book Your Service', href: '../src/pages/request-quote.html', className: 'primary' }
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
