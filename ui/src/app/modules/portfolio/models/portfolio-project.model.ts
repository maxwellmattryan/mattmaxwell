import { Id } from '@ui/core/models/model';
import { Deserializable } from '@ui/core/models/deserializable.model';

import { PortfolioProfile } from './portfolio-profile.model';

export class PortfolioProject implements Deserializable {
    constructor(partial: Partial<PortfolioProject>) {
        Object.assign(this, partial);
    }

    deserialize(input: any): this {
        Object.assign(this, input);

        this.profiles = input.profiles.map(p => new PortfolioProfile({ ...p }).deserialize(p));

        return this;
    }

    id?:            Id;

    profiles:       PortfolioProfile[];

    name:           string;
    tagline:        string;
    description:    string;

    image_url:      string;

    link_name:      string;
    link_url:       string;

    created_at:     Date;
    updated_at:     Date;
}
