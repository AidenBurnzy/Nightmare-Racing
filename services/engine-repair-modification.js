(function () {
    const serviceData = {
        title: 'Engine Repair & Modification',
        tagline: 'Blueprint-level engine repair, refreshes, and forged builds engineered to make reliable power on street or track.',
        visual: 'Short blocks, long blocks, and forced-induction packages are assembled in-house with precise tolerances, torque sequencing, and documentation so you know what lives inside your engine.',
        meta: ['Blueprint Assembly', 'Forced-Induction Ready', 'Dyno Proven'],
        sections: [
            {
                heading: 'Our capabilities',
                type: 'list',
                items: [
                    'Complete teardown, inspection, and measurement reports for OEM and performance engines',
                    'Forged rotating assemblies, ARP fastener upgrades, and performance bearing clearances',
                    'Cylinder head rebuilds, valve jobs, port work coordination, and camshaft degreeing',
                    'Calibrated engine break-in procedures and dyno validation with data logging'
                ]
            },
            {
                heading: 'Popular packages',
                type: 'list',
                items: [
                    'Streetable forged short blocks ready for moderate boost',
                    'Track-spec endurance builds with dry sump and auxiliary cooling provisions',
                    'NA high-compression combinations with matched camshaft and intake packages',
                    'OEM-plus refreshes to restore daily driven reliability'
                ]
            },
            {
                heading: 'Partner with us',
                type: 'paragraph',
                body: 'Whether you bring a fresh crate engine or a worn-out long block, we map the goal, document every tolerance, and deliver a configuration that is easy to service and ready for calibration. Our team works closely with tuners to make sure the combination lives.'
            }
        ],
        cta: {
            title: 'Plan your next engine build',
            description: 'Let’s talk about power goals, fuel choice, and use case so we can tailor an engine program that keeps you on boost and on schedule.',
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
            setText('cta-title', data.cta?.title || 'Let’s build together');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Share your power goals and we will map the path.');
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
