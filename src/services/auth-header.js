export default function authHeader() {
  // let user = JSON.parse(localStorage.getItem("user"));
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzA0OTk2ZjMwMWI4NjM4ZDMyODM2MjBlZDAyZmM0NGQ2MTViMTk5OGY4YTdlZjNiN2YzYjE4YjY4NDE1ZGViOGNkZTRhNTg0MDg1MTkyYWIiLCJpYXQiOjE2NDk5OTUwNTQuMDIyNjM2LCJuYmYiOjE2NDk5OTUwNTQuMDIyNjM5LCJleHAiOjE2NTAwODE0NTMuNzUwMTMzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.DyuWzN-56z6-9G-fpHA2csGPXupN7kJz0PNryst3HlOFPci6R4gkoOFw1E6e86bgyr__UvlEjbpfvZC5Dq8PVnW47z7di0dSFZfKnbY5Qk76_o_DvZBuSlq13B0QpB4wph8MeFSOraefkuVAQlmoMElnjO5o8zvN5x_yO3fn63G-YFoOv1kuVuw-gGWkVF8f-D_nQTx4MELGbwtjzgRd27yhObZe28_B9ey6m_uVfpsBIHVX88T5-H41wWEzKbWRdMWI02UUvNWH8Im7t-km7N7gxzw5wBGgzGZ6ApGhf9Lgn51PD3WxaFJeQUn-GTB483yUqt-dMa4GZeDIbFwczbTMbvyXvbKtvBwB6fXVKCKFo_m2cUryoS63ViZ3QiLK1nSuXDvhFv2nF47h5iQwA1zOsoiGF9XbNqao5LzLC9Ck6Yf_KhfhKrJ9Lo_oH7s_J2jGl8unAVLd74EgAkNFAyopGjvkkA9PLcBzTr63JCbE52SG1_hjuxb5RKMC74mjz6v2gGZLjCNSUZewx5fEjOwUNXz4cpqgybA53wt-y-efs3PLKI0AObXHfWu19HAMRP9a-4qhoGwZ5cqP4E20ApJqY5qAOuiJ_rUAAeev8-Q3JMnoNvM08MkLfH7tmWExdfvhUcT--1HyGmkBn-0N5mTU9W-CSSvA9z1BsIAXYtU";
  if (token) {
    return {
      Authorization: "Bearer " + token,
    };
  } else {
    return {};
  }
}
