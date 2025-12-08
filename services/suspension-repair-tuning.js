(function () {
    const serviceData = {
        title: 'Suspension Repair & Tuning',
        tagline: 'Restore precision and composure with chassis diagnostics, component replacement, and track-proven alignment strategies.',
        visual: 'From worn bushings to adjustable arms and sway bar tuning, we dial in balance so the car stays planted through every phase of a corner.',
        meta: ['Corner Weighting', 'Bushing Service', 'Custom Alignments'],
        sections: [
            {
                heading: 'What we service',
                type: 'list',
                items: [
                    'OEM and aftermarket control arms, bushings, ball joints, and end links',
                    'Strut, shock, and damper replacements with preload verification',
                    'Sway bar setup, corner-weight balancing, and bump steer correction',
                    'Chassis bracing, subframe reinforcement, and NVH troubleshooting'
                ]
            },
            {
                heading: 'Tuning methodology',
                type: 'list',
                items: [
                    'Baseline inspection with ride height, corner weights, and travel measurements',
                    'Data-informed alignment specs tailored to street, autocross, or circuit goals',
                    'Damper tuning sessions with feedback loops for rebound/compression balance',
                    'Documentation of torque specs, alignment data, and recommended follow-up intervals'
                ]
            },
            {
                heading: 'Results to expect',
                type: 'paragraph',
                body: 'Sharper turn-in, predictable mid-corner balance, and confidence when putting power down. We send you out with alignment sheets and notes so you can track performance over time.'
            }
        ],
        cta: {
            title: 'Ready to tighten up the chassis?',
            description: 'Share your current suspension setup and how you drive. We will map out repairs, upgrades, and tuning steps.',
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
            setText('cta-title', data.cta?.title || 'Let’s dial in your suspension');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Reach out with any chassis issues and we will build a plan.');
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
