(function () {
    const serviceData = {
        title: 'Fluid Service',
        tagline: 'Performance-grade fluid changes that keep engines, drivetrains, and cooling systems protected under heavy loads.',
        visual: 'We stock premium lubricants, track-proven brake and clutch fluids, and OEM-spec coolants so every system in your build can handle heat and horsepower.',
        meta: ['Motul & Amsoil', 'Track Prep', 'Interval Tracking'],
        sections: [
            {
                heading: 'What we service',
                type: 'list',
                items: [
                    'Engine oil service with OEM filters, magnetic drain plug inspection, and sample capture',
                    'Manual and dual-clutch transmission fluid cycling with adaptation resets when needed',
                    'Differential and transfer case service including additive selection for LSD units',
                    'Brake, clutch, and cooling system flushes using motorsport-grade fluids'
                ]
            },
            {
                heading: 'Why it matters',
                type: 'list',
                items: [
                    'High-output builds shear oil faster and demand tighter change intervals',
                    'Track time and towing introduce heat cycles that stress transmissions and differentials',
                    'Fresh brake and clutch fluid prevent fade and maintain pedal firmness in competition',
                    'Coolant flushes protect cylinder heads, turbo housings, and intercoolers from scaling'
                ]
            },
            {
                heading: 'Our maintenance approach',
                type: 'paragraph',
                body: 'We log fluid types, capacities, and mileage so you know exactly when to come back. Want to keep records for resale or dyno sessions? We deliver full service reports after every visit.'
            }
        ],
        cta: {
            title: 'Due for a fluid service?',
            description: 'Tell us which systems need attention and how you drive. We will prep the right products and schedule time in the bay.',
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
            setText('cta-title', data.cta?.title || 'Let’s protect your build');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Reach out and we will help you plan the next service interval.');
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
