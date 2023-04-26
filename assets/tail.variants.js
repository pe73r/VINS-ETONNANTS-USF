defineCustomElement(
  "tail-variants",
  class Variants extends HTMLElement {
    isInit = false;
    constructor() {
      super();
      this.addEventListener("click", this.onClick);
    }

    getSelectedOptions = () => {};
    init = () => {
      const selects = Array.from(this.querySelectorAll("select"));
      const inputs = Array.from(this.querySelectorAll("input"));
      this.atcs = document.querySelectorAll(`add-to-cart[data-product="${this.getAttribute("data-product")}"]`);
      this.variants = JSON.parse(this.querySelector("#product-variants").innerHTML);

      console.log(this.variants, this.atcs, this.atcs);
      selects.concat(inputs).forEach((element) => {
        element.addEventListener("change", this.onChange);
      });
      this.isInit = true;
    };

    /**
     * @param {ChangeEvent} e
     */
    onChange = (e) => {
      const value = e.target.value;
      if (this.atcs) {
        const position = e.target.getAttribute("data-position");
        const newState = Array.from(this.querySelectorAll("input:checked")).reduce((acc, input) => {
          const inputPosition = input.getAttribute("data-position");
          console.log({ inputPosition });
          acc[Number(inputPosition) - 1] = position === inputPosition ? value : input.value;
          return acc;
        }, []);
        const variant = this.variants.find((variant) => {
          return JSON.stringify(variant.options) === JSON.stringify(newState);
        });

        if (!position) {
          return;
        }
        const price = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR"
        });

        const isStroked = variant.compare_at_price && variant.compare_at_price !== variant.price;

        document.querySelectorAll("[data-dynamic-price]").forEach((element) => {
          if (isStroked && !element.hasAttribute("data-atc-price")) {
            element.classList.add("text-capucine");
          } else {
            element.classList.remove("text-capucine");
          }
          element.textContent =
            price
              .format(variant.price / 100)
              .replace("€", "")
              .trim() + "€";
        });

        document.querySelectorAll("[data-dynamic-price-stroke]").forEach((element) => {
          if (isStroked) {
            element.classList.remove("hidden");
            element.classList.add("block");
            element.textContent =
              price
                .format(variant.compare_at_price / 100)
                .replace("€", "")
                .trim() + "€";
          } else {
            element.classList.remove("block");
            element.classList.add("hidden");
          }
        });

        this.atcs.forEach((el) => el.setAttribute("data-variant", String(variant.id)));
        console.log(this.atcs);
        if (!variant?.featured_image?.src) {
          return;
        }
        const variantImg = variant?.featured_image?.src.split("v=")[1];
        document.querySelectorAll("carousel-dot").forEach((element) => {
          const img = element.querySelector("img");
          if (!img) {
            return;
          }

          if (String(img.src).includes(variantImg)) {
            element.click();
          }
        });
      }
    };

    onClick = () => {
      if (!this.isInit) {
        this.init();
      }
    };
  }
);
