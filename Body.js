document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('powerCalcForm');
    const resultDiv = document.getElementById('result');

    // Power consumption rates per square foot (Watts)
    const powerRates = {
        household: 10,
        commercial: 20,
        industrial: 30
    };

    // Average equipment power consumption (Watts)
    const equipmentRates = {
        household: 1000,
        commercial: 2500,
        industrial: 5000
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const usageType = document.getElementById('usageType').value;
        const area = parseFloat(document.getElementById('area').value);
        const equipment = parseInt(document.getElementById('equipment').value);
        const hours = parseInt(document.getElementById('hours').value);

        // Validate inputs
        if (!usageType || isNaN(area) || isNaN(equipment) || isNaN(hours)) {
            showError('Please fill all fields correctly');
            return;
        }

        // Calculate power requirements
        const areaPower = area * powerRates[usageType];
        const equipmentPower = equipment * equipmentRates[usageType];
        const totalPower = areaPower + equipmentPower;
        const dailyConsumption = (totalPower * hours) / 1000; // Convert to kWh
        const monthlyConsumption = dailyConsumption * 30;
        const recommendedGenerator = Math.ceil(totalPower * 1.2 / 1000); // 20% safety margin, convert to kVA

        // Display results
        resultDiv.innerHTML = `
            <h3>Power Requirement Results:</h3>
            <p><strong>Total Connected Load:</strong> ${(totalPower/1000).toFixed(2)} kW</p>
            <p><strong>Daily Consumption:</strong> ${dailyConsumption.toFixed(2)} kWh</p>
            <p><strong>Monthly Consumption:</strong> ${monthlyConsumption.toFixed(2)} kWh</p>
            <p><strong>Recommended Generator Size:</strong> ${recommendedGenerator} kVA</p>
        `;
        resultDiv.classList.add('show');
    });

    function showError(error) {
        resultDiv.innerHTML = `<p class="error">${error}</p>`;
        resultDiv.classList.add('show');
    }
});

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.initializeForm();
    }

    initializeForm() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addInputAnimations();
    }

    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = this.form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        }
    }

    showSuccess() {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
        this.showAlert(alert);
    }

    showError() {
        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
        this.showAlert(alert);
    }

    showAlert(alert) {
        this.form.insertAdjacentElement('beforebegin', alert);
        setTimeout(() => alert.remove(), 5000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

class PowerCalculator {
    constructor() {
        console.log("Initializing PowerCalculator");
        this.form = document.getElementById('powerCalcForm');
        this.resultDiv = document.getElementById('calculationResult');
        this.equipmentGroup = document.querySelector('.equipment-group');
        
        // Power consumption rates (Watts per sq ft)
        this.powerRates = {
            residential: 10,
            commercial: 20,
            industrial: 35
        };

        // AC unit power consumption (Watts)
        this.acRates = {
            residential: 1500,
            commercial: 3000,
            industrial: 5000
        };

        // Equipment power consumption (Watts)
        this.equipmentRates = {
            commercial: 5000,
            industrial: 10000
        };

        this.initializeCalculator();
    }

    initializeCalculator() {
        // Add event listeners for usage type changes
        const radioButtons = document.querySelectorAll('input[name="usageType"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.handleUsageTypeChange(radio.value));
        });

        // Add form submit listener
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Form submitted");
            this.calculatePower();
        });

        // Initialize with default type
        this.handleUsageTypeChange('residential');
    }

    handleUsageTypeChange(usageType) {
        console.log("Usage type changed to:", usageType);
        if (usageType === 'commercial' || usageType === 'industrial') {
            this.equipmentGroup.classList.remove('hidden');
        } else {
            this.equipmentGroup.classList.add('hidden');
        }
    }

    calculatePower() {
        try {
            const usageType = document.querySelector('input[name="usageType"]:checked').value;
            const areaSize = parseFloat(document.getElementById('areaSize').value);
            const acUnits = parseInt(document.getElementById('acUnits').value) || 0;
            const hours = parseInt(document.getElementById('hours').value);
            const heavyEquipment = parseInt(document.getElementById('heavyEquipment')?.value) || 0;

            console.log("Calculating power for:", { usageType, areaSize, acUnits, hours, heavyEquipment });

            if (this.validateInputs(areaSize, hours)) {
                // Calculate base load from area
                let totalPower = areaSize * this.powerRates[usageType];

                // Add AC power
                totalPower += acUnits * this.acRates[usageType];

                // Add equipment power if applicable
                if ((usageType === 'commercial' || usageType === 'industrial') && heavyEquipment > 0) {
                    totalPower += heavyEquipment * this.equipmentRates[usageType];
                }

                // Calculate daily consumption
                const dailyConsumption = (totalPower * hours) / 1000; // Convert to kWh
                
                // Add 20% safety margin for generator recommendation
                const recommendedPower = totalPower * 1.2;

                this.displayResult(totalPower, dailyConsumption, recommendedPower, usageType);
            }
        } catch (error) {
            console.error("Calculation error:", error);
            this.showError("An error occurred while calculating. Please check your inputs.");
        }
    }

    validateInputs(...inputs) {
        const isValid = inputs.every(input => !isNaN(input) && input > 0);
        if (!isValid) {
            this.showError('Please enter valid positive numbers for all required fields');
            return false;
        }
        return true;
    }

    displayResult(totalPower, dailyConsumption, recommendedPower, usageType) {
        const resultHTML = `
            <div class="result-content">
                <h3>Power Requirement Analysis</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <h4>Total Connected Load</h4>
                        <div class="result-value">${(totalPower/1000).toFixed(2)} kW</div>
                    </div>
                    <div class="result-item">
                        <h4>Daily Consumption</h4>
                        <div class="result-value">${dailyConsumption.toFixed(2)} kWh</div>
                    </div>
                    <div class="result-item">
                        <h4>Recommended Generator</h4>
                        <div class="result-value">${(recommendedPower/1000).toFixed(2)} kVA</div>
                    </div>
                </div>
                <div class="generator-recommendation">
                    <h4>Recommended Generator Model</h4>
                    <p>${this.getGeneratorRecommendation(recommendedPower/1000)}</p>
                </div>
            </div>
        `;

        this.resultDiv.innerHTML = resultHTML;
        this.resultDiv.classList.add('show');
        this.resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing calculator");
    new PowerCalculator();
});