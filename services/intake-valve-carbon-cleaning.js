(function () {
    const serviceData = {
        title: 'Intake Valve Carbon Cleaning',
        tagline: 'Restore lost power and throttle response on direct-injection engines with our walnut blasting and chemical cleaning process.',
        visual: 'We isolate the intake tract, media blast carbon deposits, and finish with chemical treatment so airflow, idle quality, and fuel economy return to where they belong.',
        meta: ['DI Specialists', 'Walnut Blasting', 'Restored Efficiency'],
        sections: [
            {
                heading: 'Service outline',
                type: 'list',
                items: [
                    'Inspection and borescope documentation of intake valves before cleaning',
                    'Walnut shell media blasting with sealed ports to protect cylinders',
                    'Chemical soak and brush procedure for stubborn deposits on stems and ports',
                    'Fresh gasket installation, torque verification, and ECU adaptation reset'
                ]
            },
            {
                heading: 'When to schedule',
                type: 'list',
                items: [
                    'Every 30-45k miles on boosted direct-injection engines',
                    'When experiencing cold-start misfires, hesitation, or diminished fuel economy',
                    'Before performance tunes to ensure airflow parity between cylinders',
                    'After oil separator or PCV system failures introducing excess vapors'
                ]
            },
            {
                heading: 'Results you can feel',
                type: 'paragraph',
                body: 'Expect smoother idle, quicker throttle response, restored fuel efficiency, and dyno-confirmed airflow improvements. We send you home with before-and-after photos plus maintenance recommendations to keep deposits away longer.'
            }
        ],
        cta: {
            title: 'Time for a carbon cleaning?',
            description: 'Drop us a note with your mileage and symptoms. We will confirm availability and get you on the schedule.',
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
            setText('cta-title', data.cta?.title || 'Restore performance');
        }
        if (document.getElementById('cta-description')) {
            setText('cta-description', data.cta?.description || 'Let’s remove the buildup and get power back.');
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
