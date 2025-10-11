(function () {
    const serviceData = {
        title: 'Lift Kits',
        tagline: 'Precision lift kit installations that preserve geometry, drivability, and reliability on- or off-road.',
        visual: 'From mild leveling kits to long-travel conversions, we dial in caster, camber, and driveline angles so your lifted rig tracks straight and rides smooth.',
        meta: ['Geometry Corrected', 'Driveline Safe', 'Trail Tested'],
        sections: [
            {
                heading: 'Services included',
                type: 'list',
                items: [
                    'Lift, leveling, or long-travel kit installs with new hardware torqued to spec',
                    'Control arm, track bar, and sway bar upgrades for proper geometry',
                    'Brake line, ABS, and steering extension solutions for safe articulation',
                    'Post-install alignment with caster/camber set for daily or trail duty'
                ]
            },
            {
                heading: 'Built for how you drive',
                type: 'list',
                items: [
                    'Overland builds needing load-carrying capability and on-road manners',
                    'Daily-driven trucks and SUVs wanting an aggressive stance without excess wear',
                    'Trail rigs requiring articulation, bump stop tuning, and shock calibration',
                    'Tow vehicles needing corrected driveline angles and upgraded braking'
                ]
            },
            {
                heading: 'The Nightmare Racing difference',
                type: 'paragraph',
                body: 'We use premium components, relocate or extend critical lines, and torque-map every fastener. The result is a lift that looks right, drives right, and holds alignment even after you put it through its paces.'
            }
        ],
        cta: {
            title: 'Elevate your build',
            description: 'Tell us about your terrain, tire size, and payload. We will recommend the ideal lift solution and supporting upgrades.',
            actions: [
                { label: 'Request Lift Quote', href: '../src/pages/request-quote.html', className: 'primary' },
                { label: 'Call Suspension Desk', href: 'tel:+16163291939', className: 'secondary' }
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
            setText('cta-title', data.cta?.title || 'Upgrade your suspension');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Share your goals and we will map out the lift.');
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
