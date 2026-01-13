(function () {
    const serviceData = {
        title: 'Engine Diagnostics and Performance',
        tagline: 'Unlock your engine\'s full potential with expert tuning and diagnostics.',
        visual: 'From troubleshooting drivability issues to extracting maximum horsepower, we combine cutting-edge diagnostic tools with performance expertise to optimize your engine\'s capabilities.',
        meta: ['Performance Tuning', 'ECU Programming', 'Dyno Testing'],
        sections: [
            {
                heading: 'Performance Services',
                type: 'list',
                items: [
                    'ECU tuning and custom calibration for naturally aspirated and forced induction',
                    'Dyno testing and performance verification with data logging',
                    'Intake and exhaust system optimization for maximum flow',
                    'Forced induction upgrades - turbo and supercharger installations',
                    'Fuel system upgrades including injectors, pumps, and regulators',
                    'Ignition system upgrades for improved combustion efficiency'
                ]
            },
            {
                heading: 'Diagnostic Capabilities',
                type: 'list',
                items: [
                    'Advanced OBD-II scanning with manufacturer-specific diagnostics',
                    'Real-time data monitoring and fuel trim analysis',
                    'Compression and leak-down testing for engine health assessment',
                    'Scope and multimeter testing for precise electrical diagnosis',
                    'Pre and post-modification testing to verify improvements',
                    'Emissions testing and optimization for compliance'
                ]
            },
            {
                heading: 'Performance Without Compromise',
                type: 'paragraph',
                body: 'Whether you need a drivability issue resolved or a complete performance build, we deliver solutions backed by data and experience. Our approach balances power gains with reliability, ensuring your engine performs at its peak for years to come.'
            }
        ],
        cta: {
            title: 'Ready for More Power?',
            description: 'Let\'s discuss your performance goals. From mild street builds to all-out track machines, we\'ll create a plan that fits your budget and delivers results.',
            actions: [
                { label: 'Discuss Your Build', href: '../src/pages/request-quote.html', className: 'primary' }
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
