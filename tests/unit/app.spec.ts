import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import { Suit } from '@/lib/deck';

describe('App', () => {
  test('should not have any cards drawn on first load', () => {
    const wrapper = mount(App);

    expect(wrapper.findAll('.card')).toHaveLength(0);
  });

  test('when a user clicks hit a card is drawn', async () => {
    const wrapper = mount(App);

    await wrapper.find('#hit').trigger('click');

    expect(wrapper.findAll('.player-card').length).toBe(1);
  });

  test('when a user clicks stand, the dealer draws cards', async () => {
    const wrapper = mount(App);

    await wrapper.find('#stand').trigger('click');

    expect(wrapper.findAll('.dealer-card').length).toBeGreaterThanOrEqual(2);
  });

  test('dealer will not draw after total exceeds 17', async () => {
    const wrapperA = mount(App);

    await wrapperA.setData({
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '7',
          value: 7,
          suit: Suit.CLUBS,
        },
      ],
    });

    await wrapperA.find('#stand').trigger('click');

    expect(wrapperA.findAll('.dealer-card').length).toBe(2);

    const wrapperB = mount(App);

    await wrapperB.setData({
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '6',
          value: 6,
          suit: Suit.CLUBS,
        },
      ],
    });

    await wrapperB.find('#stand').trigger('click');

    expect(wrapperB.findAll('.dealer-card').length).toBeGreaterThanOrEqual(3);
  });

  test('the player total is displayed', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '7',
          value: 7,
          suit: Suit.CLUBS,
        },
      ],
    });

    expect(wrapper.find('#player-total').text()).toContain('17');
  });

  test('the dealer total is displayed', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '2',
          value: 2,
          suit: Suit.CLUBS,
        },
      ],
    });

    expect(wrapper.find('#dealer-total').text()).toContain('12');
  });

  test('the deck is shuffled on each load', () => {
    const wrapperA = mount(App);
    const wrapperB = mount(App);

    // @ts-ignore
    expect(wrapperA.vm.shuffledDeck).not.toStrictEqual(wrapperB.vm.shuffledDeck);
  });

  test('restart button is not visible until game is over', () => {
    const wrapper = mount(App);

    expect(wrapper.find('#restart').exists()).toBeFalsy();
  });

  test('restarting the game shuffles the deck', async () => {
    const wrapper = mount(App);

    // @ts-ignore
    const before = [...wrapper.vm.shuffledDeck];

    await wrapper.setData({
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.SPADES,
        },
      ],
    });

    await wrapper.find('#restart').trigger('click');

    // @ts-ignore
    const after = [...wrapper.vm.shuffledDeck];

    expect(before).not.toStrictEqual(after);
  });

  test('user cannot hit if the game is over', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.SPADES,
        },
      ],
    });

    const button = wrapper.find('#hit');

    expect(button.attributes('disabled')).toBeTruthy();
  });

  test('user cannot hit if they have stood', async () => {
    const wrapper = mount(App);

    await wrapper.find('#stand').trigger('click');

    const button = wrapper.find('#hit');

    expect(button.attributes('disabled')).toBeTruthy();
  });

  test('user wins if game is over and their total exceeds that of dealer', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerStands: true,
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
      ],
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.HEARTS,
        },
        {
          type: '8',
          value: 8,
          suit: Suit.SPADES,
        },
      ],
    });

    expect(wrapper.find('#message').text()).toContain('You win!');
  });

  test('user wins if dealer busts', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerStands: true,
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
      ],
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.HEARTS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.SPADES,
        },
        {
          type: '8',
          value: 8,
          suit: Suit.SPADES,
        },
      ],
    });

    expect(wrapper.find('#message').text()).toContain('You win!');
  });

  test('user loses if user busts', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.HEARTS,
        },
      ],
    });

    expect(wrapper.find('#message').text()).toContain('You lost :(');
  });

  test('user loses if game is over and the total is less than that of dealer', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerStands: true,
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
      ],
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.HEARTS,
        },
        {
          type: '9',
          value: 9,
          suit: Suit.SPADES,
        },
        {
          type: '2',
          value: 2,
          suit: Suit.SPADES,
        },
      ],
    });

    expect(wrapper.find('#message').text()).toContain('You lost :(');
  });

  test('user draws if game is over and then total is equal to that of dealer', async () => {
    const wrapper = mount(App);

    await wrapper.setData({
      playerStands: true,
      playerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.CLUBS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.DIAMONDS,
        },
      ],
      dealerCards: [
        {
          type: '10',
          value: 10,
          suit: Suit.HEARTS,
        },
        {
          type: '10',
          value: 10,
          suit: Suit.SPADES,
        },
      ],
    });

    expect(wrapper.find('#message').text()).toContain('DRAW!');
  });
});
