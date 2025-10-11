(function () {
    const serviceData = {
        title: 'Exhaust Fabrication',
        tagline: 'Hand-built exhaust systems that optimize flow, tone, and clearance for street, track, and forced-induction applications.',
        visual: 'We TIG weld every joint, back-purge for maximum strength, and route the system for proper clearances so your exhaust looks as good as it sounds.',
        meta: ['TIG Welded', 'Mandrel Bent', 'Dyno Tuned'],
        sections: [
            {
                heading: 'Fabrication services',
                type: 'list',
                items: [
                    'Custom cat-back, turbo-back, and header solutions built in stainless or Inconel',
                    'Wastegate dump routing, screamer pipes, and muffler selection tailored to tone goals',
                    'Flex section placement, v-band integration, and service-friendly hanger design',
                    'Downpipe, mid-pipe, and catalytic solutions for street legality or race regulation'
                ]
            },
            {
                heading: 'Performance validation',
                type: 'list',
                items: [
                    'Dyno testing to confirm gains and back-pressure targets',
                    'Knock, EGT, and lambda monitoring for boosted applications',
                    'Sound level measurements to meet track-day compliance or personal preferences',
                    'Post-install inspection and torque verification after heat cycling'
                ]
            },
            {
                heading: 'Craftsmanship that lasts',
                type: 'paragraph',
                body: 'Every Nightmare Racing exhaust is designed around your chassis and goals. Expect perfect fitment, motorsport-grade welds, and documentation of materials, hardware, and maintenance tips.'
            }
        ],
        cta: {
            title: 'Let’s build your exhaust',
            description: 'Provide your current setup, power goals, and sound preference. We will design an exhaust that performs and makes the right kind of noise.',
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
            setText('cta-title', data.cta?.title || 'Fabricate with Nightmare');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Let’s design something that flows and sounds right.');
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
