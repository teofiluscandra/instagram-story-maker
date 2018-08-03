import {storyMaker} from '../storymaker'
import { doesNotReject } from 'assert';

describe('StoryMaker', () => {
    it('should return success if system write new image', () => {
        expect.assertions(1);
        return expect(storyMaker('Hallo!')).resolves.toBe('success');
    })
})