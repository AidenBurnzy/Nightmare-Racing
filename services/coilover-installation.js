(function () {
    const serviceData = {
        title: 'Coilover Installation',
        tagline: 'Dialed-in ride height, damping, and balance tailored to your chassis, your tires, and the way you drive.',
        visual: 'From daily comfort to time-attack discipline, our suspension techs corner-balance and preload every coilover kit so the car feels composed the moment it leaves the bay.',
        meta: ['Corner Balancing', 'Street & Track', 'Ride Height Optimization'],
        sections: [
            {
                heading: 'What we deliver',
                type: 'list',
                items: [
                    'Professional installation of coilover kits, camber plates, and ancillary hardware',
                    'Custom ride height, damper, and rebound presets for your driving environment',
                    'Corner-weight balancing to within 0.5% variance for predictable chassis response',
                    'Torque-mapped fasteners and post-install road verification'
                ]
            },
            {
                heading: 'Ideal for builds that demand',
                type: 'list',
                items: [
                    'Weekend autocross or HPDE programs transitioning from stock suspension',
                    'Stanced street cars that still need confident, repeatable handling',
                    'Track-focused chassis dialing in aero balance and braking performance',
                    'Owners seeking a repeatable baseline before custom alignment work'
                ]
            },
            {
                heading: 'How we support you',
                type: 'paragraph',
                body: 'Every coilover install includes a detailed setup sheet, alignment recommendations, and consultation on future upgrades such as sway bars, bushings, or chassis bracing. We track wear patterns and can retune the setup as you evolve the build.'
            }
        ],
        cta: {
            title: 'Ready to dial in your suspension?',
            description: 'Book dedicated time with our suspension specialists and leave with a car that turns in, brakes, and puts power down exactly the way you want.',
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

        const ctaTitle = document.getElementById('cta-title');
        const ctaDescription = document.getElementById('cta-description');
        const ctaActions = document.getElementById('cta-actions');

        if (ctaTitle) setText('cta-title', data.cta?.title || 'Let’s build together');
        if (ctaDescription) setText('cta-description', data.cta?.description || 'Connect with the Nightmare Racing crew for tailored recommendations.');

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
