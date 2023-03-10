defineCustomElement(
  "tail-filters",
  class Filters extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", this.onClick);
      this.isMobile = this.hasAttribute("data-is-mobile");
    }

    appendParams = (name, value) => {
      if (!name || !value) {
        return;
      }
      const url = this.url || new URL(window.location.href);
      const isRefined = url.searchParams.has(name);

      if (isRefined) {
        url.searchParams.delete(name);

        // previousValues.forEach((v) => {
        //   if (v !== value) {
        //     url.searchParams.append(name, v);
        //   }
        // });
        url.searchParams.append(name, value);
      } else {
        url.searchParams.append(name, value);
      }
      this.url = url;
      console.log(this.url.toString());
    };

    /**
     * @param {MouseEvent} e
     */
    onClick = (e) => {
      const applyFilter = e.composedPath().find((element) => element.tagName?.toLowerCase() === "mobile-apply-filters");
      const filter = e.composedPath().find((element) => element.tagName?.toLowerCase() === "apply-filter");

      const removing = e.composedPath().some((element) => element.tagName?.toLowerCase() === "remove-filters");
      if (filter) {
        const asyncFilter = filter.getAttribute("data-async") === "true";
        const url = this.url || new URL(window.location.href);
        const { name, value } = filter.querySelector("input") || {};
        if (!name || !value) {
          return;
        }

        const isRefined = url.searchParams.has(name) && url.searchParams.getAll(name).some((v) => v === value);

        if (isRefined) {
          const previousValues = url.searchParams.getAll(name);

          url.searchParams.delete(name);

          previousValues.forEach((v) => {
            if (v !== value) {
              url.searchParams.append(name, v);
            }
          });
        } else {
          url.searchParams.append(name, value);
        }
        if (this.isMobile) {
          this.url = url;

          this.querySelector("mobile-apply-filters").classList.remove("hidden");
        } else {
          if (asyncFilter) {
            this.url = url;

            filter.parent.querySelector("mobile-apply-filters").classList.remove("hidden");
          } else {
            window.location.href = url.toString();
          }
        }
      }

      if (applyFilter) {
        const button = this.querySelector("mobile-apply-filters");

        button.setAttribute("data-loading", String("true"));
        const { height } = button.getBoundingClientRect();
        const padding = window.getComputedStyle(button, null).getPropertyValue("padding-top");
        button.innerHTML = spinnerHtml(height - Number(padding.replace("px", "")) * 2);
        window.location.href = this.url;
      }

      if (removing) {
        const url = new URL(`${window.location.origin}${window.location.pathname}`);
        const oldUrl = new URL(window.location.href);
        if (oldUrl.searchParams.has("q")) {
          url.searchParams.set("q", oldUrl.searchParams.get("q"));
        }
        window.location.href = url.toString();
      }
    };
  }
);

const setPriceRange = (e, element) => {
  console.log({ e }, element);
  let filters = element.parentElement;
  while (filters.tagName.toLowerCase() !== "tail-filters") {
    filters = filters.parentElement;
  }

  const button = filters.querySelector("mobile-apply-filters");
  button.classList.remove("hidden");
  button.classList.add("flex");
  filters.appendParams(element.name, e);
};
defineCustomElement(
  "price-filter",
  class PriceRa extends HTMLElement {
    waitForDom = waitForDom.bind(this);

    connectedCallback() {
      this.waitForDom(["input"], ([input]) => {
        let filters = this.parentElement;
        while (!filters.tagName.toLowerCase() === "tail-filters") {
          filters = filters.parentElement;
        }
        this.filters = filters;
        console.log(this, filters, input);
        input.addEventListener("change", (e) => {
          const { name, value } = input;
          console.log({ name, value });
        });
      });
    }
  }
);
defineCustomElement("apply-filter", class ApplyFilters extends HTMLElement {});
defineCustomElement("mobile-apply-filters", class ApplyFilters extends HTMLElement {});
defineCustomElement("remove-filters", class RemoveFilters extends HTMLElement {});
defineCustomElement(
  "sort-by",
  class SortBy extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", (e) => {
        const input = this.querySelector("input");
        const url = new URL(window.location.href);

        url.searchParams.set("sort_by", input.value);
        window.location.href = url.toString();
      });
    }
  }
);
