import { test, expect } from '@playwright/test';

let imageSet = new Set

test.describe('Groups route is correct', async () => {
    test('Groups main page is correct', async ({ page }) => {
        await page.goto('http://localhost:8000/api/groups');

        // Gets the entire Groups object and turns it into JSON so it can be keyed into as an object
        const groupsObj = await page.getByText('Groups').innerText().then(res => JSON.parse(Object(res)))

        for (const group of groupsObj.Groups) {
            expect(group.id).toBeTruthy()
            expect(group.id).toBeGreaterThan(0)
            expect(group.organizerId).toBeTruthy()
            expect(group.organizerId).toBeGreaterThan(0)
            expect(group.about).toBeTruthy()
            expect(group.type).toBeTruthy()
            expect(typeof group.private).toBe(typeof true)
            expect(group.city).toBeTruthy()
            expect(group.state).toBeTruthy()
            expect(group.createdAt).toBeTruthy()
            expect(group.updatedAt).toBeTruthy()
            expect(group.createdAt <= group.updatedAt).toBeTruthy()
            expect(group.numMembers).toBeGreaterThan(0)
            if (group.previewImage) {
                expect(group.previewImage).toContain('http')
                imageSet.add(group.id)
            }
        }
    })

    test('/groups/:groupId route is correct', async ({ page }) => {
        for (let i = 0; i <= imageSet.size; i++) {
            console.log('\n imageSet: \n ', imageSet, '\n\n')
            await page.goto(`http://localhost:8000/api/groups/${i}`);
            console.log(await page.getByText('Group').innerText().then(res => JSON.parse(res)))
        }

    })
})