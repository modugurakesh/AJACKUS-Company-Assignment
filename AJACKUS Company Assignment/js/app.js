// js/app.js

// Using an IIFE (Immediately Invoked Function Expression) to create a private scope
// and a modular application structure. This is an advanced pattern that prevents
// polluting the global namespace.
const App = (() => {
    // --- 1. STATE MANAGEMENT ---
    // A single source of truth for the application's data.
    const state = {
        masterEmployeeList: [], // The original, unmodified list of all employees
        displayedEmployees: [], // The list after filtering, searching, and sorting
        currentPage: 1,
        itemsPerPage: 6,
        searchTerm: '',
        sortBy: 'id-asc',
        currentTheme: localStorage.getItem('theme') || 'light-theme',
        isModalOpen: false,
        editingEmployeeId: null,
    };

    // --- 2. DOM ELEMENT SELECTORS ---
    // Caching DOM elements for performance.
    const DOMElements = {
        displayArea: document.getElementById('employee-display-area'),
        paginationControls: document.getElementById('pagination-controls'),
        searchInput: document.getElementById('search-input'),
        sortBySelect: document.getElementById('sort-by'),
        gridViewBtn: document.getElementById('grid-view-btn'),
        listViewBtn: document.getElementById('list-view-btn'),
        modal: document.getElementById('employee-modal'),
        form: document.getElementById('employee-form'),
        formTitle: document.getElementById('form-title'),
        employeeIdInput: document.getElementById('employee-id'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        addEmployeeBtn: document.getElementById('add-employee-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        themeSwitcherBtn: document.getElementById('theme-switcher-btn'),
        loadingSpinner: document.getElementById('loading-spinner'),
    };

    // --- 3. CORE LOGIC & RENDER PIPELINE ---

    /**
     * The main render function. It orchestrates the entire process
     * of filtering, sorting, paginating, and updating the DOM.
     * This ensures a predictable and consistent UI update cycle.
     */
    const render = () => {
        showLoading(true);

        // A timeout simulates network latency and makes the loading spinner visible.
        setTimeout(() => {
            // Step 1: Filter and Search
            let processedEmployees = [...state.masterEmployeeList];
            if (state.searchTerm) {
                const lowerCaseSearch = state.searchTerm.toLowerCase();
                processedEmployees = processedEmployees.filter(emp =>
                    emp.firstName.toLowerCase().includes(lowerCaseSearch) ||
                    emp.lastName.toLowerCase().includes(lowerCaseSearch) ||
                    emp.email.toLowerCase().includes(lowerCaseSearch) ||
                    emp.role.toLowerCase().includes(lowerCaseSearch)
                );
            }

            // Step 2: Sort
            processedEmployees.sort(getSortFunction(state.sortBy));

            // Step 3: Update displayed list for pagination calculation
            state.displayedEmployees = processedEmployees;
            
            // Step 4: Paginate
            const paginatedEmployees = getPaginatedData(processedEmployees);

            // Step 5: Render to DOM
            UI.renderEmployeeCards(paginatedEmployees);
            UI.renderPagination();
            showLoading(false);
        }, 300); // Artificial delay
    };
    
    const showLoading = (isLoading) => {
        DOMElements.loadingSpinner.classList.toggle('hidden', !isLoading);
        DOMElements.displayArea.classList.toggle('hidden', isLoading);
    };

    const getSortFunction = (sortBy) => {
        const [key, order] = sortBy.split('-');
        return (a, b) => {
            let valA, valB;
            switch(key) {
                case 'name':
                    valA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    valB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'department':
                    valA = a.department.toLowerCase();
                    valB = b.department.toLowerCase();
                    break;
                default: // id
                    valA = a.id;
                    valB = b.id;
            }
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        };
    };

    const getPaginatedData = (employees) => {
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        return employees.slice(startIndex, endIndex);
    };

    // --- 4. UI MANIPULATION MODULE ---
    // Encapsulates all direct DOM manipulation.
    const UI = {
        renderEmployeeCards: (employees) => {
            DOMElements.displayArea.innerHTML = '';
            if (employees.length === 0) {
                DOMElements.displayArea.innerHTML = '<p class="no-results">No employees match your criteria.</p>';
                return;
            }
            const fragment = document.createDocumentFragment();
            employees.forEach(emp => {
                const card = UI.createEmployeeCard(emp);
                fragment.appendChild(card);
            });
            DOMElements.displayArea.appendChild(fragment);
        },
        createEmployeeCard: (emp) => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.dataset.id = emp.id;
            card.innerHTML = `
                <div class="employee-card__info">
                    <h3>${emp.firstName} ${emp.lastName}</h3>
                    <p><strong>Role:</strong> ${emp.role}</p>
                    <p class="email"><strong>Email:</strong> ${emp.email}</p>
                    <p class="department"><strong>Dept:</strong> ${emp.department}</p>
                </div>
                <div class="employee-card__actions">
                    <button class="btn btn-secondary edit-btn" data-id="${emp.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${emp.id}">Delete</button>
                </div>`;
            return card;
        },
        renderPagination: () => {
            DOMElements.paginationControls.innerHTML = '';
            const totalPages = Math.ceil(state.displayedEmployees.length / state.itemsPerPage);
            if (totalPages <= 1) return;

            const fragment = document.createDocumentFragment();

            // Previous Button
            const prevBtn = document.createElement('button');
            prevBtn.textContent = 'Previous';
            prevBtn.disabled = state.currentPage === 1;
            prevBtn.addEventListener('click', () => {
                state.currentPage--;
                render();
            });
            fragment.appendChild(prevBtn);

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                if (i === state.currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.addEventListener('click', () => {
                    state.currentPage = i;
                    render();
                });
                fragment.appendChild(pageBtn);
            }

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next';
            nextBtn.disabled = state.currentPage === totalPages;
            nextBtn.addEventListener('click', () => {
                state.currentPage++;
                render();
            });
            fragment.appendChild(nextBtn);

            DOMElements.paginationControls.appendChild(fragment);
        },
        toggleView: (view) => {
            DOMElements.displayArea.className = view;
            DOMElements.gridViewBtn.classList.toggle('active', view === 'employee-grid');
            DOMElements.listViewBtn.classList.toggle('active', view === 'employee-list');
        },
        toggleTheme: () => {
            state.currentTheme = state.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
            document.body.className = state.currentTheme;
            localStorage.setItem('theme', state.currentTheme);
        },
        openModal: (isEdit = false, employee = null) => {
            DOMElements.form.reset();
            Validation.clearAllErrors();
            state.isModalOpen = true;
            if (isEdit && employee) {
                DOMElements.formTitle.textContent = 'Edit Employee';
                state.editingEmployeeId = employee.id;
                DOMElements.employeeIdInput.value = employee.id;
                DOMElements.form.firstName.value = employee.firstName;
                DOMElements.form.lastName.value = employee.lastName;
                DOMElements.form.email.value = employee.email;
                DOMElements.form.department.value = employee.department;
                DOMElements.form.role.value = employee.role;
            } else {
                DOMElements.formTitle.textContent = 'Add New Employee';
                state.editingEmployeeId = null;
            }
            DOMElements.modal.classList.remove('hidden');
        },
        closeModal: () => {
            state.isModalOpen = false;
            state.editingEmployeeId = null;
            DOMElements.modal.classList.add('hidden');
        }
    };

    // --- 5. FORM VALIDATION MODULE ---
    const Validation = {
        validateForm: () => {
            let isValid = true;
            Validation.clearAllErrors();

            const fields = [
                { input: DOMElements.form.firstName, rule: 'required' },
                { input: DOMElements.form.lastName, rule: 'required' },
                { input: DOMElements.form.email, rule: 'email' },
                { input: DOMElements.form.department, rule: 'required' },
                { input: DOMElements.form.role, rule: 'required' },
            ];
            
            fields.forEach(({input, rule}) => {
                if (!Validation.validateField(input, rule)) {
                    isValid = false;
                }
            });
            return isValid;
        },
        validateField: (input, rule) => {
             let valid = true;
             let message = '';

             const value = input.value.trim();
             if (rule === 'required' && !value) {
                valid = false;
                message = 'This field is required.';
             } else if (rule === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!value) {
                    valid = false;
                    message = 'This field is required.';
                } else if (!emailRegex.test(value)) {
                    valid = false;
                    message = 'Please enter a valid email address.';
                }
             }

             if(!valid) Validation.showError(input, message);
             return valid;
        },
        showError: (input, message) => {
            const group = input.closest('.form-group');
            input.classList.add('invalid');
            group.querySelector('.error-message').textContent = message;
        },
        clearAllErrors: () => {
            DOMElements.form.querySelectorAll('.form-group').forEach(group => {
                group.querySelector('input').classList.remove('invalid');
                group.querySelector('.error-message').textContent = '';
            });
        }
    };
    
    // --- 6. EVENT HANDLERS & BINDINGS ---
    const bindEvents = () => {
        // Search
        DOMElements.searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value;
            state.currentPage = 1; // Reset to first page on new search
            render();
        });

        // Sort
        DOMElements.sortBySelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            render();
        });

        // View Toggles
        DOMElements.gridViewBtn.addEventListener('click', () => UI.toggleView('employee-grid'));
        DOMElements.listViewBtn.addEventListener('click', () => UI.toggleView('employee-list'));

        // Theme Switcher
        DOMElements.themeSwitcherBtn.addEventListener('click', UI.toggleTheme);
        
        // Modal and Form Actions
        DOMElements.addEmployeeBtn.addEventListener('click', () => UI.openModal());
        DOMElements.closeModalBtn.addEventListener('click', () => UI.closeModal());
        DOMElements.cancelBtn.addEventListener('click', () => UI.closeModal());
        DOMElements.modal.addEventListener('click', (e) => {
            if (e.target === DOMElements.modal) UI.closeModal(); // Close on overlay click
        });

        // Form Submission
        DOMElements.form.addEventListener('submit', handleFormSubmit);

        // Event Delegation for Edit/Delete
        DOMElements.displayArea.addEventListener('click', handleCardActions);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!Validation.validateForm()) return;
        
        const employeeData = {
            id: state.editingEmployeeId || Date.now(), // Use existing or create new ID
            firstName: DOMElements.form.firstName.value,
            lastName: DOMElements.form.lastName.value,
            email: DOMElements.form.email.value,
            department: DOMElements.form.department.value,
            role: DOMElements.form.role.value,
        };

        if (state.editingEmployeeId) {
            // Edit
            const index = state.masterEmployeeList.findIndex(emp => emp.id === state.editingEmployeeId);
            state.masterEmployeeList[index] = employeeData;
        } else {
            // Add
            state.masterEmployeeList.unshift(employeeData); // Add to beginning of list
        }
        
        UI.closeModal();
        render();
    };
    
    const handleCardActions = (e) => {
        const target = e.target;
        const id = Number(target.dataset.id);

        if (target.classList.contains('edit-btn')) {
            const employeeToEdit = state.masterEmployeeList.find(emp => emp.id === id);
            if (employeeToEdit) UI.openModal(true, employeeToEdit);
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete this employee? This action cannot be undone.`)) {
                state.masterEmployeeList = state.masterEmployeeList.filter(emp => emp.id !== id);
                render();
            }
        }
    };


    // --- 7. INITIALIZATION ---
    const init = () => {
        console.log('Initializing Employee Directory...');
        // Simulate Freemarker injection: copy mock data into our state
        state.masterEmployeeList = [...mockEmployees];
        document.body.className = state.currentTheme;
        bindEvents();
        render(); // Initial render
    };

    // Publicly expose only the init function.
    return {
        init: init,
    };
})();

// Start the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', App.init);