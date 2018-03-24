import React from 'react';

const SideNav = ({title, navItems, activeItem, onClick, onAddClick}) => {
  const navLinks = navItems.map(i => {
    let style = "side-nav-link";
    style += i === activeItem ? " is-active" : "";
    return <a href="#" onClick={onClick} className={style} name={i} key={i}>{i}</a>
  }
  )
  return (
    <aside className="side-nav">
      <h4 className="side-nav-title">{title}
        <button
          style={{"padding": 2, "marginTop": -3}}
          className="right btn btn-transparent icon-ui-plus-circled icon-ui-flush"
          onClick={onAddClick}/>
      </h4>
      <nav aria-labelledby="sidenav">
        {navLinks}
      </nav>
    </aside>
  )
};

export default SideNav;