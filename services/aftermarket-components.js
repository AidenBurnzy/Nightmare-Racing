(function () {
    const serviceData = {
        title: 'Aftermarket Components',
        tagline: 'Sourcing, installing, and validating aftermarket components that complement your build rather than complicate it.',
        visual: 'We curate parts that fit your goals, confirm compatibility, and install them with the same documentation quality as our full builds. Less guesswork, more performance.',
        meta: ['Proven Manufacturers', 'OEM+ Integration', 'Future-Proof Planning'],
        sections: [
            {
                heading: 'Component planning',
                type: 'list',
                items: [
                    'Consultation to align parts selection with power, budget, and drivability goals',
                    'Vendor relationships for suspension, braking, fueling, driveline, and aero suppliers',
                    'Verification of supporting mods, consumables, and ECU calibration requirements',
                    'Install kits organized with hardware, torque specs, and maintenance notes'
                ]
            },
            {
                heading: 'Popular upgrades',
                type: 'list',
                items: [
                    'Intakes, intercoolers, charge pipes, and throttle body enhancements',
                    'Fuel systems including pumps, injectors, and ethanol conversions',
                    'Clutch and driveline upgrades tuned for street, strip, or endurance use',
                    'Cooling system reinforcements for boosted or track-driven applications'
                ]
            },
            {
                heading: 'Why enthusiasts rely on us',
                type: 'paragraph',
                body: 'We have seen every combination from catalog bolt-ons to complex hybrid setups. Our process zeroes in on parts that actually deliver, installs them cleanly, and sends you home with a plan for the next phase of the build.'
            }
        ],
        cta: {
            title: 'Need parts you can trust?',
            description: 'Share your current mod list and future goals. We will assemble a components roadmap that keeps the car balanced and reliable.',
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
            setText('cta-title', data.cta?.title || 'Upgrade with confidence');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Tell us how you use the car and we will tailor the parts list.');
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
