import React, { useState } from 'react';

export interface CreateWatchFormProps {
    onSubmitSuccess: () => void;
}

interface WatchFormData {
    name: string;
    vehicles: boolean;
    trailsAndRoads: boolean;
    buildingsAndInfrastructure: boolean;
    fires: boolean;
    forest: boolean;
    temporarySettlements: boolean;
    watchEvery: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

const CreateWatchFormComponent: React.FC<CreateWatchFormProps> = ({
    onSubmitSuccess
}) => {
    const [formData, setFormData] = useState<WatchFormData>({
        name: '',
        vehicles: false,
        trailsAndRoads: false,
        buildingsAndInfrastructure: false,
        fires: false,
        forest: false,
        temporarySettlements: false,
        watchEvery: 'daily',
    });

    const handleCheckboxChange = (field: keyof WatchFormData) => {
        setFormData(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleWatchEveryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            watchEvery: e.target.value as 'hourly' | 'daily' | 'weekly' | 'monthly'
        }));
    };

    const handleSelectAll = () => {
        const allTrue = !formData.vehicles && !formData.trailsAndRoads &&
            !formData.buildingsAndInfrastructure && !formData.fires && !formData.forest && !formData.temporarySettlements;

        setFormData(prev => ({
            ...prev,
            vehicles: allTrue,
            trailsAndRoads: allTrue,
            buildingsAndInfrastructure: allTrue,
            fires: allTrue,
            forest: allTrue,
            temporarySettlements: allTrue,
        }));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that at least one checkbox is selected and name is provided
        const selectedCategories = Object.entries(formData)
            .filter(([key, value]) => key !== 'name' && key !== 'watchEvery' && value)
            .map(([key]) => key);

        if (!formData.name.trim()) {
            alert('Please provide a name for this watch location.');
            return;
        }

        if (selectedCategories.length === 0) {
            alert('Please select at least one category to watch.');
            return;
        }

        // Log the form data (in a real app, this would be sent to an API)
        console.log('Creating watch with data:', {
            name: formData.name,
            categories: selectedCategories,
            watchEvery: formData.watchEvery,
            selectedArea: '120k Square kilometers',
        });

        // Show success message
        alert(`Watch "${formData.name}" created successfully!`);

        // Call the success callback to close the sidebar
        onSubmitSuccess();
    };

    const allSelected = formData.vehicles && formData.trailsAndRoads &&
        formData.buildingsAndInfrastructure && formData.fires && formData.forest && formData.temporarySettlements;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Watch Name Input */}
            <div>
                <label htmlFor="watch-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Watch Location Name
                </label>
                <input
                    id="watch-name"
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Enter a name for this watch location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
            </div>

            {/* Watch Every Dropdown */}
            <div>
                <label htmlFor="watch-every" className="block text-sm font-medium text-gray-700 mb-2">
                    Watch Every
                </label>
                <select
                    id="watch-every"
                    value={formData.watchEvery}
                    onChange={handleWatchEveryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                    <option value="hourly">Hour</option>
                    <option value="daily">Day</option>
                    <option value="weekly">Week</option>
                    <option value="monthly">Month</option>
                </select>
            </div>

            {/* Categories Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Watch for</h3>
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                    >
                        {allSelected ? 'Unselect All' : 'Select All'}
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Vehicles */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.vehicles}
                            onChange={() => handleCheckboxChange('vehicles')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Vehicles</span>
                    </label>

                    {/* Trails and roads */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.trailsAndRoads}
                            onChange={() => handleCheckboxChange('trailsAndRoads')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Trails and roads</span>
                    </label>

                    {/* Buildings and infrastructure */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.buildingsAndInfrastructure}
                            onChange={() => handleCheckboxChange('buildingsAndInfrastructure')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Buildings and infrastructure</span>
                    </label>

                    {/* Fires */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.fires}
                            onChange={() => handleCheckboxChange('fires')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Smoke</span>
                    </label>

                    {/* Forest */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.forest}
                            onChange={() => handleCheckboxChange('forest')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Wildlife</span>
                    </label>

                    {/* Temporary settlements */}
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                        <input
                            type="checkbox"
                            checked={formData.temporarySettlements}
                            onChange={() => handleCheckboxChange('temporarySettlements')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Temporary settlements</span>
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 font-medium"
                >
                    Create Watch
                </button>
            </div>
        </form>
    );
};

export default CreateWatchFormComponent;
