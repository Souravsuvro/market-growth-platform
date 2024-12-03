import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    BusinessProfile,
    CompanySize,
    TargetMarket,
    LocationPriority,
    CompetitionLevel,
    ChallengeCategory,
    ChallengePriority,
    TechnologyCategory
} from '../../types/business';

const companySizes: CompanySize[] = ['1-10', '11-50', '51-200', '200+'];
const targetMarkets: TargetMarket[] = ['B2B', 'B2C', 'Both'];
const locationPriorities: LocationPriority[] = ['primary', 'secondary', 'future'];
const competitionLevels: CompetitionLevel[] = ['low', 'medium', 'high'];
const challengeCategories: ChallengeCategory[] = ['operational', 'financial', 'marketing', 'technical', 'competitive'];
const challengePriorities: ChallengePriority[] = ['high', 'medium', 'low'];
const technologyCategories: TechnologyCategory[] = ['marketing', 'sales', 'operations', 'finance', 'customer_service'];

export const EnhancedProfileForm: React.FC = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<BusinessProfile>({
        defaultValues: {
            preferredLocations: [{ country: '', city: '', priority: 'primary' }],
            currentChallenges: [{ category: 'operational', description: '', priority: 'medium', impactArea: [] }],
            technologyStack: [{ category: 'marketing', toolName: '', purpose: '' }]
        }
    });

    const {
        fields: locationFields,
        append: appendLocation,
        remove: removeLocation
    } = useFieldArray({
        control,
        name: 'preferredLocations'
    });

    const {
        fields: challengeFields,
        append: appendChallenge,
        remove: removeChallenge
    } = useFieldArray({
        control,
        name: 'currentChallenges'
    });

    const {
        fields: techFields,
        append: appendTech,
        remove: removeTech
    } = useFieldArray({
        control,
        name: 'technologyStack'
    });

    const onSubmit = async (data: BusinessProfile) => {
        try {
            // TODO: Implement API call
            console.log('Form data:', data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        {...register('companyName', { required: 'Company name is required' })}
                        placeholder="Company Name"
                        className="input-field"
                    />
                    <input
                        {...register('industry', { required: 'Industry is required' })}
                        placeholder="Industry"
                        className="input-field"
                    />
                    <input
                        {...register('monthlyRevenue', { required: 'Monthly revenue is required' })}
                        type="number"
                        placeholder="Monthly Revenue"
                        className="input-field"
                    />
                    <select
                        {...register('companySize', { required: 'Company size is required' })}
                        className="input-field"
                    >
                        {companySizes.map(size => (
                            <option key={size} value={size}>{size} employees</option>
                        ))}
                    </select>
                    <select
                        {...register('targetMarket', { required: 'Target market is required' })}
                        className="input-field"
                    >
                        {targetMarkets.map(market => (
                            <option key={market} value={market}>{market}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Website Information */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Website Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        {...register('website.url')}
                        placeholder="Website URL"
                        className="input-field"
                    />
                    <input
                        {...register('website.monthlyTraffic')}
                        type="number"
                        placeholder="Monthly Traffic"
                        className="input-field"
                    />
                    <input
                        {...register('website.conversionRate')}
                        type="number"
                        step="0.01"
                        placeholder="Conversion Rate (%)"
                        className="input-field"
                    />
                </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Preferred Locations</h2>
                    <button
                        type="button"
                        onClick={() => appendLocation({ country: '', city: '', priority: 'primary' })}
                        className="btn-secondary"
                    >
                        Add Location
                    </button>
                </div>
                {locationFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input
                            {...register(`preferredLocations.${index}.country`)}
                            placeholder="Country"
                            className="input-field"
                        />
                        <input
                            {...register(`preferredLocations.${index}.city`)}
                            placeholder="City"
                            className="input-field"
                        />
                        <select
                            {...register(`preferredLocations.${index}.priority`)}
                            className="input-field"
                        >
                            {locationPriorities.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => removeLocation(index)}
                            className="btn-danger"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Current Challenges */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Current Challenges</h2>
                    <button
                        type="button"
                        onClick={() => appendChallenge({
                            category: 'operational',
                            description: '',
                            priority: 'medium',
                            impactArea: []
                        })}
                        className="btn-secondary"
                    >
                        Add Challenge
                    </button>
                </div>
                {challengeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <select
                            {...register(`currentChallenges.${index}.category`)}
                            className="input-field"
                        >
                            {challengeCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            {...register(`currentChallenges.${index}.description`)}
                            placeholder="Description"
                            className="input-field"
                        />
                        <select
                            {...register(`currentChallenges.${index}.priority`)}
                            className="input-field"
                        >
                            {challengePriorities.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => removeChallenge(index)}
                            className="btn-danger"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Technology Stack */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Technology Stack</h2>
                    <button
                        type="button"
                        onClick={() => appendTech({
                            category: 'marketing',
                            toolName: '',
                            purpose: ''
                        })}
                        className="btn-secondary"
                    >
                        Add Technology
                    </button>
                </div>
                {techFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <select
                            {...register(`technologyStack.${index}.category`)}
                            className="input-field"
                        >
                            {technologyCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            {...register(`technologyStack.${index}.toolName`)}
                            placeholder="Tool Name"
                            className="input-field"
                        />
                        <input
                            {...register(`technologyStack.${index}.purpose`)}
                            placeholder="Purpose"
                            className="input-field"
                        />
                        <button
                            type="button"
                            onClick={() => removeTech(index)}
                            className="btn-danger"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                    Save Profile
                </button>
            </div>
        </form>
    );
};

export default EnhancedProfileForm;
