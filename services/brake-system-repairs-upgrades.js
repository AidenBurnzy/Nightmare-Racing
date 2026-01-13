(function () {
    const serviceData = {
        title: 'Brake System Repairs and Upgrades',
        tagline: 'Expert brake service ensuring your safety with every stop.',
        visual: 'From routine brake pad replacement to complete system overhauls, we deliver reliable stopping power you can trust. Our certified technicians use premium parts and precision techniques.',
        meta: ['Brake Pads & Rotors', 'ABS System Service', 'Performance Upgrades'],
        sections: [
            {
                heading: 'Our Brake Services',
                type: 'list',
                items: [
                    'Brake pad and rotor replacement with premium OEM or performance parts',
                    'Brake fluid flush and ABS system diagnostics',
                    'Caliper rebuild, replacement, and brake line service',
                    'Performance brake upgrades including big brake kits and stainless steel lines',
                    'Brake noise diagnosis and vibration correction',
                    'Emergency brake service and adjustment'
                ]
            },
            {
                heading: 'Why Choose NMR for Brakes',
                type: 'list',
                items: [
                    'Comprehensive inspection of entire brake system on every service',
                    'Quality parts from trusted manufacturers with warranty protection',
                    'Precision machining and proper break-in procedures',
                    'Detailed before and after measurements and documentation',
                    'Same-day service available for most brake repairs',
                    'Free brake inspection with any service visit'
                ]
            },
            {
                heading: 'Safety You Can Trust',
                type: 'paragraph',
                body: 'Your brakes are your most important safety system. At NMR Automotive, we never cut corners on brake service. Every job includes a thorough inspection, proper bedding procedure, and road test to ensure optimal performance.'
            }
        ],
        cta: {
            title: 'Concerned About Your Brakes?',
            description: 'Schedule a free brake inspection today. Our experts will assess your system and provide honest recommendations.',
            actions: [
                { label: 'Book Your Brake Service', href: '../src/pages/request-quote.html', className: 'primary' }
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
