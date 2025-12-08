(function () {
    const serviceData = {
        title: 'Camshaft Swaps & Upgrades',
        tagline: 'Unlock power where you need it with camshaft packages matched to your induction, fueling, and ECU strategy.',
        visual: 'From street-friendly grinds to high-lift track profiles, we handle degreed installs, valvetrain upgrades, and calibration so every RPM hits hard.',
        meta: ['Degreeing & Timing', 'Valvetrain Packages', 'ECU Calibration'],
        sections: [
            {
                heading: 'What is included',
                type: 'list',
                items: [
                    'Detailed consultation on powerband goals, forced induction plans, and drivability expectations',
                    'Camshaft installation with new seals, phasers, and timing components as required',
                    'Supporting valvetrain upgrades such as springs, retainers, lifters, and pushrods',
                    'Degreeing and timing verification with before/after compression and leakdown checks'
                ]
            },
            {
                heading: 'Calibration support',
                type: 'list',
                items: [
                    'Base map adjustments for idle quality, fueling, and VVT strategies',
                    'Dyno collaborations to finalize spark, fueling, and cam phasing',
                    'Data logging sessions to refine cold start, part-throttle, and high-RPM behavior',
                    'Post-install support to monitor wear-in and recommend oil change intervals'
                ]
            },
            {
                heading: 'Built for longevity',
                type: 'paragraph',
                body: 'Every cam swap leaves with clearances documented, break-in oil recommendations, and maintenance intervals. Whether it is NA torque or boosted top-end power, we make sure it stays reliable.'
            }
        ],
        cta: {
            title: 'Planning a cam upgrade?',
            description: 'Send over your mod list, intended use, and timeline. We will spec the right cam, supporting parts, and calibration path.',
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
            setText('cta-title', data.cta?.title || 'Let’s build your powerband');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'We will spec the right cam combo and keep the street manners you need.');
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
                if (action.href.startsWith('http')) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
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
