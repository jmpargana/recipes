import { shallowMount } from "@vue/test-utils"
import Tags from "../../src/components/Tags.vue"
import store from "../../src/store"

const factory = () =>
  shallowMount(Tags, {
    global: {
      plugins: [store],
    },
  })

describe("Tags", () => {
  it("mounts tags with initial tags", async () => {
    const wrapper = factory()
    expect(wrapper.findAll("svg").length).toEqual(2)
  })

  it("deletes object from store when triggering click event", async () => {
    const wrapper = factory()
    const icon = wrapper.find("svg")
    await icon.trigger("click")
    expect(wrapper.findAll("svg").length).toEqual(1)
    expect(store.state.tags.length).toEqual(1)
  })

  it("renders new tag when store receives object", async () => {
    const wrapper = factory()
    store.commit("addTag", { tag: "something" })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll("svg").length).toEqual(2)
    expect(
      wrapper
        .findAll("div.border-red-600")[1]
        .find("div")
        .text()
    ).toEqual("something")
  })
})
